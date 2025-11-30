CREATE TABLE IF NOT EXISTS venues (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    type VARCHAR(50) NOT NULL,
    image_url TEXT,
    rating DECIMAL(2,1) DEFAULT 4.5,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    venue_id INTEGER NOT NULL REFERENCES venues(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    event_date DATE NOT NULL,
    guests_count INTEGER NOT NULL,
    base_price INTEGER NOT NULL,
    commission_amount INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending',
    booking_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_venue ON bookings(venue_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(booking_status);

INSERT INTO venues (name, city, capacity, price, type, image_url, rating, description) VALUES
('Золотой Век', 'Москва', 200, 150000, 'Свадьба', 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b8?w=800&h=600&fit=crop', 4.9, 'Роскошный банкетный зал с классическим интерьером и панорамными окнами'),
('Империал Холл', 'Санкт-Петербург', 300, 250000, 'Корпоратив', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop', 4.8, 'Элегантное пространство с мраморными колоннами и хрустальными люстрами'),
('Версаль', 'Казань', 150, 120000, 'Банкет', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop', 4.7, 'Изысканный зал в стиле французского барокко с садом для церемоний'),
('Атриум', 'Екатеринбург', 250, 180000, 'Свадьба', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop', 4.9, 'Современный зал с атриумом, живой зеленью и естественным светом'),
('Кристалл', 'Новосибирск', 180, 140000, 'Корпоратив', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop', 4.6, 'Элегантное пространство с авторским дизайном и премиум-акустикой'),
('Аристократ', 'Москва', 220, 200000, 'Банкет', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', 4.8, 'Дворцовый зал с антикварной мебелью и изысканным декором');