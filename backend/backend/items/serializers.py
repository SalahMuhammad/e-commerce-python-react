from rest_framework import serializers
from items.models import Items, Images


class Base64ImageField(serializers.ImageField):
	"""
	A Django REST framework field for handling image-uploads through raw post data.
	It uses base64 for encoding and decoding the contents of the file.

	Heavily based on
	https://github.com/tomchristie/django-rest-framework/pull/1268

	Updated for Django REST framework 3.
	"""

	def to_internal_value(self, data):
		from django.core.files.base import ContentFile
		import base64
		import six
		import uuid

		if isinstance(data, six.string_types):            
			# Check if the base64 string is in the "data:" format
			if 'data:' in data and ';base64,' in data:
				# Break out the header from the base64 content
				header, data = data.split(';base64,')

			# Try to decode the file. Return validation error if it fails.
			try:
				decoded_file = base64.b64decode(data)
			except TypeError:
				self.fail('invalid_image')

			# Generate file name:
			file_name = str(uuid.uuid4())[:12] # 12 characters are more than enough.
			# Get the file name extension:
			file_extension = self.get_file_extension(file_name, decoded_file)

			complete_file_name = "%s.%s" % (file_name, file_extension, )

			data = ContentFile(decoded_file, name=complete_file_name)
		return super(Base64ImageField, self).to_internal_value(data)

	def get_file_extension(self, file_name, decoded_file):
		import imghdr

		extension = imghdr.what(file_name, decoded_file)
		extension = "jpg" if extension == "jpeg" else extension
		return extension


class ImagesSerializer(serializers.ModelSerializer):
	img = Base64ImageField(
		required=False,
		max_length=10000, 
		use_url=True,
	)

	
	class Meta:
		model = Images
		fields = ['img']


class ItemsSerializer(serializers.ModelSerializer):
	by_username = serializers.SerializerMethodField()
	has_img = serializers.SerializerMethodField()
	# images = ImagesSerializer(many=True, read_only=True)
	images = serializers.SerializerMethodField()
	images_upload = serializers.ListField(
			required=False,
			child=Base64ImageField(),
			write_only=True,
		)

	
	class Meta:
		model = Items
		fields = '__all__'


	def __init__(self, *args, **kwargs):
		fieldss = kwargs.pop('fields', None)
		super(ItemsSerializer, self).__init__(*args, **kwargs)
		if fieldss is not None:
			allowed = set(fieldss)
			existing = set(self.fields.keys())
			for field_name in existing - allowed:
				self.fields.pop(field_name)

	def create(self, validated_data):
		images_data = validated_data.pop('images_upload', [])
		item = super().create(validated_data)
		self.update_images(item, images_data)
		return item
	
	def update(self, instance, validated_data):
		images_data = validated_data.pop('images_upload', [])
		item = super().update(instance, validated_data)
		self.update_images(item, images_data)
		return item

	def get_by_username(self, obj):
		return obj.by.username
	
	def get_has_img(self, obj):
		return obj.images.exists()

	def get_images(self, obj):
		return [f'http://localhost:8000{image.img.url}' for image in obj.images.all()]

	def update_images(self, instance, images_data):
		if images_data:
			for image in instance.images.all():
				image.img.delete()  # Deletes the file from the filesystem
				image.delete()  # Deletes the record from the database

			for image_data in images_data:
				instance.images.create(item=instance, img=image_data)

  