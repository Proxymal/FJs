export const cookies = {
    set: function(key, value, attributes) {
        if (typeof document === 'undefined') {
          return
        }
    
        attributes = assign({}, defaultAttributes, attributes)
    
        if (typeof attributes.expires === 'number') {
          attributes.expires = new Date(Date.now() + attributes.expires * 864e5)
        }
        if (attributes.expires) {
          attributes.expires = attributes.expires.toUTCString()
        }
    
        key = encodeURIComponent(key)
          .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
          .replace(/[()]/g, escape)
    
        value = converter.write(value, key)
    
        var stringifiedAttributes = ''
        for (var attributeName in attributes) {
          if (!attributes[attributeName]) {
            continue
          }
    
          stringifiedAttributes += '; ' + attributeName
    
          if (attributes[attributeName] === true) {
            continue
          }
          
          stringifiedAttributes += '=' + attributes[attributeName].split(';')[0]
        }
    
        return (document.cookie = key + '=' + value + stringifiedAttributes)
    },
    get: function(key) {
        if (typeof document === 'undefined' || (arguments.length && !key)) {
          return
        }
    
        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : []
        var jar = {}
        for (var i = 0; i < cookies.length; i++) {
          var parts = cookies[i].split('=')
          var value = parts.slice(1).join('=')
    
          if (value[0] === '"') {
            value = value.slice(1, -1)
          }
    
          try {
            var foundKey = defaultConverter.read(parts[0])
            jar[foundKey] = converter.read(value, foundKey)
    
            if (key === foundKey) {
              break
            }
          } catch (e) {}
        }
    
        return key ? jar[key] : jar
    },
    remove: function (key, attributes) {
        set(key,'',
          assign({}, attributes, {
            expires: -1
          })
        )
    }
}