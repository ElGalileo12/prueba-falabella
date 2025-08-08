from django.urls import path
from .views import ClientSearchAPIView, ExportClientAPIView, FidelizadosReportAPIView

urlpatterns = [
    path('clients/search/', ClientSearchAPIView.as_view(), name='client-search'),
    path('clients/<int:pk>/export/', ExportClientAPIView.as_view(), name='client-export'),
    path('reports/fidelizados/', FidelizadosReportAPIView.as_view(), name='fidelizados-report'),
]
