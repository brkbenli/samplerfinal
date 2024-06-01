import requests
from bs4 import BeautifulSoup
import mysql.connector
from PIL import Image
from io import BytesIO

# Function to crop image to 500x500
def crop_image(img):
    return img.resize((500, 500))

# Connect to MySQL database
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="signup"
)

mycursor = mydb.cursor()

# Check if the audio_tracks table exists and create it if not
mycursor.execute("""
    CREATE TABLE IF NOT EXISTS audio_tracks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255),
        duration VARCHAR(50),
        file_url VARCHAR(255),
        cover_art MEDIUMBLOB
    )
""")

# Commit changes to database
mydb.commit()

# URL of the webpage to scrape
url = "https://archive.org/details/fela-kuti-the-best-of-the-black-president/Fela+Kuti/The+Best+Of+The+Black+President/CD+1/01-Lady.mp3"

try:
    # Send a GET request to the URL
    response = requests.get(url)
    response.raise_for_status()  # Check if the request was successful
except requests.exceptions.RequestException as e:
    print(f"Error fetching the URL: {e}")
    mydb.close()
    exit()

# Parse HTML content
soup = BeautifulSoup(response.text, "html.parser")

# Extract track information
tracks = soup.find_all("div", itemtype="http://schema.org/AudioObject")

# Extract cover art URL
cover_art_tag = soup.find("link", itemprop="image")
if cover_art_tag:
    cover_art_url = cover_art_tag["href"]

    try:
        # Download cover art
        cover_art_response = requests.get(cover_art_url)
        cover_art_response.raise_for_status()
        cover_art_image = Image.open(BytesIO(cover_art_response.content))
        cover_art_image = crop_image(cover_art_image)

        # Convert image to bytes
        buffered = BytesIO()
        cover_art_image.save(buffered, format="JPEG")
        img_byte = buffered.getvalue()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching the cover art URL: {e}")
        mydb.close()
        exit()
else:
    print("Cover art URL not found.")
    mydb.close()
    exit()

# Insert track information into database
for track in tracks:
    name = track.find("meta", itemprop="name")["content"]
    duration = track.find("meta", itemprop="duration")["content"]
    file_url = track.find("link", itemprop="associatedMedia")["href"]

    # Insert track data into database
    sql = "INSERT INTO audio_tracks (name, duration, file_url, cover_art) VALUES (%s, %s, %s, %s)"
    val = (name, duration, file_url, img_byte)
    mycursor.execute(sql, val)

    print(f"{name} inserted successfully")

# Commit changes to database
mydb.commit()

print("Tracks inserted successfully")

# Close database connection
mydb.close()