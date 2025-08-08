from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from django.http import HttpResponse
import pandas as pd
from io import BytesIO
from .models import Client, Purchase
from .serializers import ClientSerializer


class ClientSearchAPIView(APIView):
    def get(self, request):
        doc_number = request.query_params.get("doc_number")
        if not doc_number:
            return Response(
                {"error": "Parámetro 'doc_number' es requerido"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        client = get_object_or_404(Client, document_number=doc_number)
        serializer = ClientSerializer(client)
        return Response(serializer.data)


class ExportClientAPIView(APIView):
    def get(self, request, pk):
        client = get_object_or_404(Client, pk=pk)
        data = {
            "document_type": client.document_type.name,
            "document_number": client.document_number,
            "first_name": client.first_name,
            "last_name": client.last_name,
            "email": client.email,
            "phone": client.phone,
        }
        df = pd.DataFrame([data])

        csv_data = df.to_csv(index=False)
        response = HttpResponse(csv_data, content_type="text/csv")
        response["Content-Disposition"] = (
            f"attachment; filename=client_{client.document_number}.csv"
        )
        return response


class FidelizadosReportAPIView(APIView):
    def get(self, request):
        today = timezone.now().date()
        first_day_this_month = today.replace(day=1)
        last_month_end = first_day_this_month - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)

        qs = (
            Purchase.objects.filter(date__range=(last_month_start, last_month_end))
            .values("client")
            .annotate(total=Sum("amount"))
            .filter(total__gt=5000000)
        )

        rows = []
        for item in qs:
            client = Client.objects.get(pk=item["client"])
            rows.append(
                {
                    "document_type": client.document_type.name,
                    "document_number": client.document_number,
                    "first_name": client.first_name,
                    "last_name": client.last_name,
                    "email": client.email,
                    "phone": client.phone,
                    "total_last_month": float(item["total"]),
                }
            )

        df = pd.DataFrame(rows)
        buffer = BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)
        resp = HttpResponse(
            buffer,
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        resp["Content-Disposition"] = (
            f'attachment; filename=fidelizados_{last_month_start.strftime("%Y_%m")}.xlsx'
        )
        return resp
