function doGet() {
    return HtmlService.createHtmlOutputFromFile("index.html")
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setTitle("Mintcraft Command Generator");
  }
  