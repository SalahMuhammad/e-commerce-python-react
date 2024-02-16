import os


def removeImgFromFileSystem(response, instance):
  """
    removing img from file system if response status code 204 or 200
  """
  if response.status_code == 204 or response.status_code == 200:
    try:
      os.remove(instance.img.path)
    except OSError as e:
      print(f"removeImgFromFileSystem() OS Error: {e.strerror}")
    except ValueError as e:
      print(f"removeImgFromFileSystem() Value Error: {e}")
    except Exception as e:
      print(f'removeImgFromFileSystem() Error: {e}')