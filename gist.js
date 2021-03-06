(function (factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['jquery'], factory)
  } else if (typeof exports === 'object') {
    module.exports = factory(require('jquery'))
  } else {
    factory(jQuery)
  }
}(function ($) {
  'use strict';

  var Gist = function (element) {
    this.$gist = $(element)
    this.request()
  }

  Gist.prototype.request = function () {
    var id   = this.$gist.data('gist')
    var file = this.$gist.data('file') || false
    var url  = 'https://gist.github.com/' + id + '.json'

    if (file) {
      url += '?file=' + file
    }

    var self = this

    $.ajax({
      url: url,
      dataType: 'jsonp',
      cache: true,
      success: function (data, textStatus, jqXHR) {
        self.onAjaxSuccess(self, data, textStatus, jqXHR)
      },
      error: function (jqXHR, textStatus, errorThrown) {
        self.onAjaxError(self, jqXHR, textStatus, errorThrown)
      }
    })
  }

  Gist.prototype.onAjaxSuccess = function (self, data, textStatus, jqXHR) {
    if (! data || ! 'div' in data) {
      self.onAjaxError()
      return
    }

    // Append the stylesheet if it doesn't exists.
    // Trying to minimize requests.
    if (! $('link[href="' + data.stylesheet + '"]').length) {
      $(document.head).append('<link href="' + data.stylesheet + '" rel="stylesheet">')
    }

    self.$gist.html(data.div)
  }

  Gist.prototype.onAjaxError = function (self, jqXHR, textStatus, errorThrown) {
    self.$gist.html(':(')
  }

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('gist-initialized')

      if (! data) {
        $this.data('gist-initialized', (data = new Gist(this)))
      }
    })
  }

  var old = $.fn.gist

  $.fn.gist             = Plugin
  $.fn.gist.Constructor = Gist

  $.fn.gist.noConflict = function () {
    $.fn.gist = old
    return this
  }
}))