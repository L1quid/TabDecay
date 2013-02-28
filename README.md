Tab Decay
========

A Chrome extension which bookmarks and closes unused tabs.

Decay
-----

Users select a length of time, and tabs which are unused for that long are then decayed (bookmarked, archived, closed).

In addition to idle time, a constraint on the maximum number of allowed open tabs is planned.  Once the max. is hit, the oldest tab is closed.

Bookmarking
-----------

Saves bookmarks in folders by date of last activity.  Open a URL on 2013-01-01; when closed by Tab Decay, the bookmark is placed in Decayed Tabs -> 2013-01-01.

Archival
--------

An optional web service provides the backend for storing HTML archives and PNG screenshots of pages, ensuring users have access to pages even if the original site goes offline.  Users have the option of enabling client-side encryption, which prevents the web service from having any information about a user's bookmarks.

Exceptions
----------

Tab Decay does not act on Chrome system and pinned tabs.  A whitelist feature is also planned.

Authors
-------

Written by: Daniel Green
Contributors: Ben Engebreth, Lee Cunliffe, Chris Kiahtipes, Joshua Teitelbaum
