import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Webhook для обработки уведомлений о статусе платежа от ЮKassa
    Args: event с httpMethod (POST), body с данными о платеже
    Returns: HTTP response 200 OK
    '''
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    
    payment_object = body_data.get('object', {})
    payment_status = payment_object.get('status')
    metadata = payment_object.get('metadata', {})
    booking_id = metadata.get('booking_id')
    
    if not booking_id:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'message': 'No booking_id in metadata'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    if payment_status == 'succeeded':
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(f"""
            UPDATE bookings 
            SET payment_status = 'paid', 
                booking_status = 'confirmed',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = {booking_id}
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
    
    elif payment_status == 'canceled':
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(f"""
            UPDATE bookings 
            SET payment_status = 'failed',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = {booking_id}
        """)
        
        conn.commit()
        cursor.close()
        conn.close()
    
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': 'Webhook processed'}),
        'isBase64Encoded': False
    }
