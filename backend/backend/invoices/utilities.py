from .models import PurchaseInvoice, SalesInvoice
from items.models import Items
import json


def get_invoice_type(self):
	full_url = self.request.build_absolute_uri()
	return PurchaseInvoice if full_url.__contains__('purchase') else SalesInvoice

def update_items_prices(invoice_type, items_list, status_code):
	if invoice_type == PurchaseInvoice and status_code in (200, 201):
		try:
			with open('pp/profitPercentage.json') as profit_percentage:
				pp = json.load(profit_percentage)
			for dict in items_list:
				unit_price = float(dict['unit_price'])
				item = Items.objects.get(pk=dict['item'])
				if not item.price1 == unit_price:
					item.price1 = unit_price
					item.price2 = round(unit_price * float(pp['price2']) + unit_price, 2)
					item.price3 = round(unit_price * float(pp['price3']) + unit_price, 2)
					item.price4 = round(unit_price * float(pp['price4']) + unit_price, 2)
					item.save()
		except Exception as e:
			print(f'an error occurred while updating items prices: {e}')
