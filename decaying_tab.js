var DecayingTab = function(tab)
{
  this.url = tab.url;
  this.timestamp = new Date().getTime();
  this.id = tab.id;
  this.active = tab.active;
  this.title = tab.title;
};
