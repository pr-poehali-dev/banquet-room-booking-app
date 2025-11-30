import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-card border-border animate-scale-in">
        <CardContent className="p-12 text-center space-y-6">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-fade-in">
            <Icon name="CheckCircle" size={64} className="text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-foreground">
            Оплата успешно выполнена!
          </h1>

          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Ваше бронирование подтверждено. Мы отправили все детали на указанную почту.
          </p>

          <div className="bg-secondary/30 rounded-lg p-6 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-primary mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-2">Что дальше?</p>
                <ul className="space-y-2">
                  <li>• Владелец зала свяжется с вами в течение 24 часов</li>
                  <li>• Проверьте почту для подробной информации о бронировании</li>
                  <li>• Комиссия 3% уже включена в оплату</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6"
            >
              Вернуться на главную
            </Button>
            <p className="text-sm text-muted-foreground">
              Автоматический переход через {countdown} секунд
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
