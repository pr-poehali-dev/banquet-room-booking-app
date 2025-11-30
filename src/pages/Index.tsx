import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Venue {
  id: number;
  name: string;
  city: string;
  capacity: number;
  price: number;
  type: string;
  image: string;
  rating: number;
  description: string;
}

const mockVenues: Venue[] = [
  {
    id: 1,
    name: 'Золотой Век',
    city: 'Москва',
    capacity: 200,
    price: 150000,
    type: 'Свадьба',
    image: 'https://images.unsplash.com/photo-1519167758481-83f29da8c2b8?w=800&h=600&fit=crop',
    rating: 4.9,
    description: 'Роскошный банкетный зал с классическим интерьером и панорамными окнами'
  },
  {
    id: 2,
    name: 'Империал Холл',
    city: 'Санкт-Петербург',
    capacity: 300,
    price: 250000,
    type: 'Корпоратив',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop',
    rating: 4.8,
    description: 'Элегантное пространство с мраморными колоннами и хрустальными люстрами'
  },
  {
    id: 3,
    name: 'Версаль',
    city: 'Казань',
    capacity: 150,
    price: 120000,
    type: 'Банкет',
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800&h=600&fit=crop',
    rating: 4.7,
    description: 'Изысканный зал в стиле французского барокко с садом для церемоний'
  },
  {
    id: 4,
    name: 'Атриум',
    city: 'Екатеринбург',
    capacity: 250,
    price: 180000,
    type: 'Свадьба',
    image: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&h=600&fit=crop',
    rating: 4.9,
    description: 'Современный зал с атриумом, живой зеленью и естественным светом'
  },
  {
    id: 5,
    name: 'Кристалл',
    city: 'Новосибирск',
    capacity: 180,
    price: 140000,
    type: 'Корпоратив',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop',
    rating: 4.6,
    description: 'Элегантное пространство с авторским дизайном и премиум-акустикой'
  },
  {
    id: 6,
    name: 'Аристократ',
    city: 'Москва',
    capacity: 220,
    price: 200000,
    type: 'Банкет',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    rating: 4.8,
    description: 'Дворцовый зал с антикварной мебелью и изысканным декором'
  }
];

const cities = ['Все города', 'Москва', 'Санкт-Петербург', 'Казань', 'Екатеринбург', 'Новосибирск'];
const eventTypes = ['Все типы', 'Свадьба', 'Корпоратив', 'Банкет'];

export default function Index() {
  const [selectedCity, setSelectedCity] = useState('Все города');
  const [selectedType, setSelectedType] = useState('Все типы');
  const [minCapacity, setMinCapacity] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [guests, setGuests] = useState('');

  const filteredVenues = mockVenues.filter(venue => {
    const cityMatch = selectedCity === 'Все города' || venue.city === selectedCity;
    const typeMatch = selectedType === 'Все типы' || venue.type === selectedType;
    const capacityMatch = !minCapacity || venue.capacity >= parseInt(minCapacity);
    return cityMatch && typeMatch && capacityMatch;
  });

  const calculateCommission = (price: number) => {
    return price * 0.03;
  };

  const calculateTotal = (price: number) => {
    return price + calculateCommission(price);
  };

  const handleBooking = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-primary">БанкетЗалы.РФ</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Icon name="Phone" size={20} className="mr-2" />
                +7 (800) 555-35-35
              </Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-6xl font-bold mb-4 text-foreground">
              Элитные банкетные залы
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Премиум-площадки для незабываемых торжеств по всей России
            </p>
          </div>

          <Card className="max-w-5xl mx-auto bg-card/50 backdrop-blur-sm border-border animate-scale-in">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Город</Label>
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Тип мероприятия</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {eventTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Мин. вместимость</Label>
                  <Input
                    type="number"
                    placeholder="Количество гостей"
                    value={minCapacity}
                    onChange={(e) => setMinCapacity(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">Дата мероприятия</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-background border-border">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PP', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                <span>Найдено залов: {filteredVenues.length}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedCity('Все города');
                    setSelectedType('Все типы');
                    setMinCapacity('');
                    setSelectedDate(undefined);
                  }}
                >
                  Сбросить фильтры
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVenues.map((venue, index) => (
            <Card 
              key={venue.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-border bg-card cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative overflow-hidden h-64">
                <img 
                  src={venue.image} 
                  alt={venue.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Icon name="Star" size={14} className="fill-current" />
                  {venue.rating}
                </div>
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-xs font-medium">
                  {venue.type}
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {venue.name}
                </h3>
                
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Icon name="MapPin" size={16} />
                  <span className="text-sm">{venue.city}</span>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {venue.description}
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-2 text-sm">
                    <Icon name="Users" size={16} className="text-primary" />
                    <span className="text-muted-foreground">до {venue.capacity} гостей</span>
                  </div>
                </div>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Стоимость аренды</p>
                    <p className="text-2xl font-bold text-primary">
                      {venue.price.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => handleBooking(venue)}
                  >
                    Забронировать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-foreground">
              Бронирование зала
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedVenue?.name} · {selectedVenue?.city}
            </DialogDescription>
          </DialogHeader>

          {selectedVenue && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Дата мероприятия</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start bg-background border-border">
                        <Icon name="Calendar" className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PP', { locale: ru }) : 'Выберите дату'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Количество гостей</Label>
                  <Input
                    type="number"
                    placeholder="Введите количество"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    max={selectedVenue.capacity}
                    className="bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Максимум: {selectedVenue.capacity} гостей
                  </p>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-6 space-y-3">
                <h4 className="font-semibold text-lg text-foreground mb-4">Детали бронирования</h4>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Аренда зала</span>
                  <span className="font-medium text-foreground">
                    {selectedVenue.price.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-muted-foreground">Комиссия сервиса (3%)</span>
                  <span className="font-medium text-primary">
                    {calculateCommission(selectedVenue.price).toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-semibold text-foreground">Итого к оплате</span>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotal(selectedVenue.price).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-4 flex items-start gap-3">
                <Icon name="Info" size={20} className="text-primary mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Условия бронирования</p>
                  <p>Комиссия 3% взимается автоматически при подтверждении бронирования владельцем зала. Бронирование становится активным после внесения предоплаты 30%.</p>
                </div>
              </div>

              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
                disabled={!selectedDate || !guests}
              >
                <Icon name="CheckCircle" className="mr-2" />
                Подтвердить бронирование
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="border-t border-border mt-20 py-12 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-primary">БанкетЗалы.РФ</h3>
              <p className="text-sm text-muted-foreground">
                Сервис бронирования премиум банкетных залов по всей России
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  <span>+7 (800) 555-35-35</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  <span>info@banket-zaly.ru</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Информация</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>О компании</li>
                <li>Партнёрам</li>
                <li>Условия сервиса</li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
            © 2024 БанкетЗалы.РФ. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
