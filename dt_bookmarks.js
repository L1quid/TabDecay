DT.create_bookmark = function(dtab)
{
  // save in folders by date, mafucka

  var bookmark = {
    parentId: DT.bookmark_folder,
    title: dtab.title,
    url: dtab.url,
  };

  var bookmark_folder_title = dtab.timestamp ? new Date(dtab.timestamp).toLocaleDateString() : "On-demand";

  chrome.bookmarks.getTree(function(bookmarks) {
    var bookmark_id = DT.check_for_bookmark_folder(bookmarks, bookmark_folder_title);

    if (!bookmark_id)
    {
      var bookmark_folder = {
        parentId: DT.bookmark_folder,
        title: bookmark_folder_title
      };

      chrome.bookmarks.create(bookmark_folder, function(new_bookmark) {
        bookmark.parentId = new_bookmark.id;
        DT.create_bookmark_if_not_exists(bookmark);
        delete bookmark_folder;
      });
    }
    else
    {
      bookmark.parentId = bookmark_id;
      DT.create_bookmark_if_not_exists(bookmark);
    }
  });
};

DT.create_bookmark_if_not_exists = function(bookmark)
{
  chrome.bookmarks.getSubTree(bookmark.parentId, function(bookmarks) {
    for (var i = 0; i < bookmarks.length; i++)
    {
      for (var j = 0; j < bookmarks[i].children.length; j++)
      {
        if (bookmarks[i].children[j].url == bookmark.url)
          return;
      }
    }

    chrome.bookmarks.create(bookmark);
    delete bookmark;
  });
};

DT.check_for_bookmark_folder = function(bookmarks, title)
{
  if (bookmarks.length == 0)
    return null;

  for (var i = 0; i < bookmarks.length; i++)
  {
    var bookmark = bookmarks[i];

    if (bookmark.url)
      continue;

    if (bookmark.title == title)
      return(bookmark.id);

    if (bookmark.children.length > 0)
    {
      var bookmark_id = DT.check_for_bookmark_folder(bookmark.children, title);

      if (bookmark_id)
        return(bookmark_id);
    }
  }

  return(null);
};
