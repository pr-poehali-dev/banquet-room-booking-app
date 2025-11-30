import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Получение списка банкетных залов с фильтрацией
    Args: event с httpMethod (GET), queryStringParameters (city, type, minCapacity)
    Returns: HTTP response с массивом залов
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    params = event.get('queryStringParameters') or {}
    city = params.get('city')
    event_type = params.get('type')
    min_capacity = params.get('minCapacity')
    
    database_url = os.environ.get('DATABASE_URL')
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    query = "SELECT id, name, city, capacity, price, type, image_url, rating, description FROM venues WHERE 1=1"
    
    if city and city != 'Все города':
        query += f" AND city = '{city}'"
    
    if event_type and event_type != 'Все типы':
        query += f" AND type = '{event_type}'"
    
    if min_capacity:
        query += f" AND capacity >= {int(min_capacity)}"
    
    query += " ORDER BY rating DESC, name ASC"
    
    cursor.execute(query)
    venues = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    venues_list = []
    for venue in venues:
        venues_list.append({
            'id': venue['id'],
            'name': venue['name'],
            'city': venue['city'],
            'capacity': venue['capacity'],
            'price': venue['price'],
            'type': venue['type'],
            'image': venue['image_url'],
            'rating': float(venue['rating']) if venue['rating'] else 4.5,
            'description': venue['description']
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'venues': venues_list}),
        'isBase64Encoded': False
    }
