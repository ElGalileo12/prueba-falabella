from rest_framework import serializers
from .models import DocumentType, Client, Purchase


class DocumentTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentType
        fields = ["id", "code", "name"]


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ["id", "date", "amount", "description"]


class ClientSerializer(serializers.ModelSerializer):
    purchases = PurchaseSerializer(many=True, read_only=True)
    document_type = DocumentTypeSerializer(read_only=True)

    class Meta:
        model = Client
        fields = [
            "id",
            "document_type",
            "document_number",
            "first_name",
            "last_name",
            "email",
            "phone",
            "purchases",
        ]
