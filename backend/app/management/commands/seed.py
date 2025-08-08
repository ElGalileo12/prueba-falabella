from django.core.management.base import BaseCommand
from app.models import DocumentType, Client, Purchase
from faker import Faker
from datetime import date, timedelta
import random


class Command(BaseCommand):
    help = "Genera datos de prueba para la base de datos"

    def handle(self, *args, **kwargs):
        fake = Faker("es_CO")

        dt, _ = DocumentType.objects.get_or_create(
            code="CC", name="Cédula de Ciudadanía"
        )

        vip_client = Client.objects.create(
            document_type=dt,
            document_number="1234",
            first_name="Pedro",
            last_name="Pérez",
            email="pedro.perez@example.com",
            phone="3001234567",
        )

        today = date.today()
        first_day_this_month = today.replace(day=1)
        last_month_end = first_day_this_month - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)

        Purchase.objects.create(
            client=vip_client,
            date=last_month_start + timedelta(days=2),
            amount=3000000,
            description="Compra electrodomésticos",
        )
        Purchase.objects.create(
            client=vip_client,
            date=last_month_start + timedelta(days=10),
            amount=2500000,
            description="Compra muebles",
        )

        for _ in range(5):
            client = Client.objects.create(
                document_type=dt,
                document_number=fake.unique.random_number(digits=4),
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.email(),
                phone=fake.phone_number(),
            )
            for _ in range(random.randint(1, 4)):
                Purchase.objects.create(
                    client=client,
                    date=fake.date_this_year(),
                    amount=random.randint(100000, 2000000),
                    description=fake.sentence(),
                )

        self.stdout.write(self.style.SUCCESS("Datos de prueba creados correctamente."))
