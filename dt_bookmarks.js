DT.create_bookmark = function(dtab)
{
  // save in folders by date, mafucka

  var bookmark = {
    parentId: DT.bookmark_folder,
    title: dtab.title,
    url: dtab.url,
  };

  chrome.bookmarks.getSubTree(DT.bookmark_folder, function(bookmarks) {
    for (var i = 0; i < bookmarks.length; i++)
    {
      if (bookmarks[i].url == bookmark.url)
        return;
    }

    chrome.bookmarks.create(bookmark);
  });

  delete bookmark;
};
