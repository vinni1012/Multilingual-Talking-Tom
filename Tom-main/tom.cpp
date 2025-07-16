#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <SoftwareSerial.h>
#include <DFRobotDFPlayerMini.h>

// Replace with your network credentials
const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";

// Google Translate API key
const char* apiKey = "your_GOOGLE_TRANSLATE_API_KEY";

// Target languages
const char* targetLanguages[] = {"te", "ta", "hi"}; // Telugu, Tamil, Hindi

// Pins for DFPlayer Mini
SoftwareSerial mySoftwareSerial(16, 17); // RX, TX
DFRobotDFPlayerMini myDFPlayer;

// Pins for Voice Recognition Module
SoftwareSerial voiceSerial(4, 5); // RX, TX

void setup() {
  Serial.begin(115200);
  mySoftwareSerial.begin(9600);
  voiceSerial.begin(9600);

  if (!myDFPlayer.begin(mySoftwareSerial)) {
    Serial.println("Unable to begin DFPlayer Mini");
    while (true);
  }
  myDFPlayer.volume(30); // Set volume to maximum (0 to 30)

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (voiceSerial.available()) {
    String sentence = voiceSerial.readStringUntil('\n');
    Serial.println("Recognized Sentence: " + sentence);

    for (int i = 0; i < 3; i++) {
      String translatedText = translateText(sentence, targetLanguages[i]);
      Serial.println("Translated Text: " + translatedText);
      speakText(translatedText);
      delay(5000); // Wait for 5 seconds before the next translation
    }
  }
  delay(1000); // Wait for 1 second before checking for new input
}

String translateText(String text, const char* targetLang) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    String url = "https://translation.googleapis.com/language/translate/v2?key=" + String(apiKey) + "&q=" + text + "&target=" + targetLang;
    http.begin(url);
    int httpCode = http.GET();

    if (httpCode > 0) {
      String payload = http.getString();
      DynamicJsonDocument doc(1024);
      deserializeJson(doc, payload);
      const char* translatedText = doc["data"]["translations"][0]["translatedText"];
      http.end();
      return String(translatedText);
    } else {
      Serial.println("Error on HTTP request");
      http.end();
      return "";
    }
  } else {
    Serial.println("WiFi not connected");
    return "";
  }
}

void speakText(String text) {
  // Convert text to speech using DFPlayer Mini
  // This is a placeholder function. You need to convert the text to audio files and store them on an SD card.
  // Then, play the corresponding audio file using DFPlayer Mini.
  // Example: myDFPlayer.play(1); // Play the first audio file
  Serial.println("Speaking: " + text);
}