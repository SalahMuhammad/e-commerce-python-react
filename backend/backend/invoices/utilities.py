from .models import PurchaseInvoice, SalesInvoice
from items.models import Items
import json


def get_invoice_type(self):
	full_url = self.request.build_absolute_uri()
	return PurchaseInvoice if full_url.__contains__('purchase') else SalesInvoice

def update_items_prices(items_list, status_code):
	if status_code in (200, 201):
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

def compare_items(instance_items, validated_items):
    """
        return list consists of item ids
    """
    
    instance_items_set = set(
        (item.item.id) for item in instance_items) # , item.quantity
    
    validated_items_set = set(
        (validated_item['item'].id) for validated_item in validated_items) # , validated_item.get('quantity', 1)

    # Items to remove and add
    items_to_remove = instance_items_set - validated_items_set
    items_to_add = validated_items_set - instance_items_set
    # print(items_to_remove)
    # print(items_to_add)
    return items_to_remove, items_to_add