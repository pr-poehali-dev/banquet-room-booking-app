import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Создание и управление бронированиями залов
    Args: event с httpMethod (GET, POST), body для POST с данными бронирования
    Returns: HTTP response с данными бронирования
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        
        venue_id = body_data.get('venueId')
        customer_name = body_data.get('customerName')
        customer_email = body_data.get('customerEmail')
        customer_phone = body_data.get('customerPhone')
        event_date = body_data.get('eventDate')
        guests_count = body_data.get('guestsCount')
        
        if not all([venue_id, customer_name, customer_email, customer_phone, event_date, guests_count]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Missing required fields'}),
                'isBase64Encoded': False
            }
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute(f"SELECT price FROM venues WHERE id = {venue_id}")
        venue = cursor.fetchone()
        
        if not venue:
            cursor.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Venue not found'}),
                'isBase64Encoded': False
            }
        
        base_price = venue['price']
        commission_amount = int(base_price * 0.03)
        total_amount = base_price + commission_amount
        
        insert_query = f"""
            INSERT INTO bookings 
            (venue_id, customer_name, customer_email, customer_phone, event_date, guests_count, 
             base_price, commission_amount, total_amount, payment_status, booking_status)
            VALUES 
            ({venue_id}, '{customer_name}', '{customer_email}', '{customer_phone}', '{event_date}', 
             {guests_count}, {base_price}, {commission_amount}, {total_amount}, 'pending', 'pending')
            RETURNING id, venue_id, customer_name, customer_email, event_date, guests_count, 
                      base_price, commission_amount, total_amount, payment_status, booking_status, created_at
        """
        
        cursor.execute(insert_query)
        booking = cursor.fetchone()
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'booking': {
                    'id': booking['id'],
                    'venueId': booking['venue_id'],
                    'customerName': booking['customer_name'],
                    'customerEmail': booking['customer_email'],
                    'eventDate': str(booking['event_date']),
                    'guestsCount': booking['guests_count'],
                    'basePrice': booking['base_price'],
                    'commissionAmount': booking['commission_amount'],
                    'totalAmount': booking['total_amount'],
                    'paymentStatus': booking['payment_status'],
                    'bookingStatus': booking['booking_status'],
                    'createdAt': booking['created_at'].isoformat()
                }
            }),
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        booking_id = params.get('id')
        
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if booking_id:
            cursor.execute(f"""
                SELECT b.*, v.name as venue_name, v.city as venue_city 
                FROM bookings b 
                JOIN venues v ON b.venue_id = v.id 
                WHERE b.id = {booking_id}
            """)
            booking = cursor.fetchone()
            
            if not booking:
                cursor.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Booking not found'}),
                    'isBase64Encoded': False
                }
            
            result = {
                'id': booking['id'],
                'venueId': booking['venue_id'],
                'venueName': booking['venue_name'],
                'venueCity': booking['venue_city'],
                'customerName': booking['customer_name'],
                'customerEmail': booking['customer_email'],
                'eventDate': str(booking['event_date']),
                'guestsCount': booking['guests_count'],
                'basePrice': booking['base_price'],
                'commissionAmount': booking['commission_amount'],
                'totalAmount': booking['total_amount'],
                'paymentStatus': booking['payment_status'],
                'bookingStatus': booking['booking_status']
            }
        else:
            cursor.execute("""
                SELECT b.*, v.name as venue_name, v.city as venue_city 
                FROM bookings b 
                JOIN venues v ON b.venue_id = v.id 
                ORDER BY b.created_at DESC 
                LIMIT 50
            """)
            bookings = cursor.fetchall()
            
            result = {
                'bookings': [
                    {
                        'id': b['id'],
                        'venueId': b['venue_id'],
                        'venueName': b['venue_name'],
                        'venueCity': b['venue_city'],
                        'customerName': b['customer_name'],
                        'eventDate': str(b['event_date']),
                        'guestsCount': b['guests_count'],
                        'totalAmount': b['total_amount'],
                        'paymentStatus': b['payment_status'],
                        'bookingStatus': b['booking_status']
                    }
                    for b in bookings
                ]
            }
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result),
            'isBase64Encoded': False
        }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
