chrome.extension.onMessage.addListener(function(request, sender, callback)
{
  if (request.action == 'dt_get_source')
  {
    callback(document.documentElement.outerHTML);
  }
});
