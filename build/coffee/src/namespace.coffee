do (root = this, factory = (global, document) ->
  NS = "Flickable"

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