###
  Flickable.js - based on flipsnap.js (http://pxgrid.github.com/js-flipsnap/)
  
  Version: 0.1
  Author:  @yuya

  Licensed under the MIT License:
  http://www.opensource.org/licenses/mit-license.php
###

do (root = this, factory = (global, document) ->
  NS         = "Flickable"
  global[NS] = {}
) ->
  # AMD
  if typeof define is "function" and define.amd is "object"
    define(NS, [], ->
      factory(root, root.document)
      root[NS]
    )
  # Browser global scope
  else
    factory(root, root.document)