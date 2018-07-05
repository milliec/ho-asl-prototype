/* global $ */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

// Make jQuery :contains Case-Insensitive
// https://css-tricks.com/snippets/jquery/make-jquery-contains-case-insensitive/
// NEW selector
jQuery.expr[':'].Contains = function (a, i, m) {
  return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0
}

// OVERWRITES old selecor
jQuery.expr[':'].contains = function (a, i, m) {
  return jQuery(a).text().toUpperCase()
    .indexOf(m[3].toUpperCase()) >= 0
}

// Cases search function
$('.js-case-search').click(function (e) {
  e.preventDefault()
  var search = $('.js-case-search-query').val()

  $('.cases tbody tr').each(function () {
    $(this).hide()
  })

  $('.cases tbody tr td:contains("' + search + '")')
    .parent('tr')
    .show()
})

// User search function
$('.js-user-search').click(function (e) {
  e.preventDefault()
  var search = $('.js-user-search-query').val()

  $('.users tbody tr').each(function () {
    $(this).hide()
  })

  $('.users tbody tr td:contains("' + search + '")')
    .parent('tr')
    .show()
})

// Cases tabs function
$('.js-my-cases').click(function (e) {
  e.preventDefault()
  $(this).siblings('.tab--active').removeClass('tab--active')
  $(this).addClass('tab--active')
  $('.all-cases-view').hide()
  $('.my-cases-view').show()

  var search = 'Joe Bloggs'

  $('.cases tbody tr').each(function () {
    $(this).hide()
  })

  $('.cases tbody tr td:contains("' + search + '")')
    .parent('tr')
    .show()
})
$('.js-all-cases').click(function (e) {
  e.preventDefault()
  $(this).siblings('.tab--active').removeClass('tab--active')
  $(this).addClass('tab--active')
  $('.all-cases-view').show()
  $('.my-cases-view').hide()

  var search = ''

  $('.cases tbody tr').each(function () {
    $(this).hide()
  })

  $('.cases tbody tr td:contains("' + search + '")')
    .parent('tr')
    .show()
})

// Tabs
// Left hand tab navigation, e.g. caseworker screen
$('.leftnavlinks').click(function (e) {
  e.preventDefault()
  var current = $('.leftnavlinks.active').data('target')
  var target = $(this).data('target')

  // If the continue button is selected
  if (($(this).hasClass('button')) && ($('#comp-notes').val() == 'error')) {
    $('.error-example').show()
    $('.error-will-be-checked').click()
    $('.will-be-error').removeClass('will-be-error').addClass('error')
    $('html,body').scrollTop(0)
    $('.tag--risk').show()
  }
  else if (($(this).hasClass('button')) && ($('#comp-notes').val() != 'error')) {
    $('.leftnavcontent').hide()
    $('#' + target).show()
    $('.leftnavlinks').removeClass('active')
    $('.' + target).addClass('active')
    $('html,body').scrollTop(0)
    $('.' + target).parent().prev().find('.tag--complete').show()

    // remove all if this is a resubmit
    $('.' + current + '-results').find('tr').remove()

    // Store and display case details
    // loop through any form input with class of .store...
    $('#' + current + ' .store').each(function (index, value) {
      //store the name attribute (key) and the value entered (value)...
      var thisKey = $(this).attr('name')
      var thisVal = $(this).val()

      if (thisVal.length > 0) {
        $('.results-title').removeClass('visuallyhidden')
        $('.' + current + '-results')
          .append(
            '<tr><th>' + thisKey + '</th><td>' + thisVal + '</td></tr>'
          )
          .show()
      }
    })
  }
  else {
    $('.leftnavcontent').hide()
    $('#' + target).show()
    $('.leftnavlinks').removeClass('active')
    $('.' + target).addClass('active')
  }

}) // /left links

// Check if all fields are done, mark nav as complete
$('form.check-fields').each(function () {
  var form = $(this)
  var current = $(this).data('current')

  // this concept replaces the continue buttons so hide for now
  form.find('.button').hide()

  form.find(':radio').change(function () {
    var names = {}
    form.find(':radio').each(function () {
      names[$(this).attr('name')] = true
    })
    var count = 0
    $.each(names, function () {
      count++
    })
    if (form.find(':radio:checked').length === count) {
      $('.' + current).find('.tag--complete').show()
    }
  })
})

// $('.form input:radio').each(function() {

//    $(this).blur( function() {
//        var complete = true;

//        $('.form input:radio').each(function() {
//          if ( !$(this':checked').val() ) {
//              complete = false;
//          }
//        });

//        if ( complete == true ) {
//            console.log ('complete')
//        }
//    });

//  });

// Notes on caseworker page
$('.js-add-note').click(function () {
  $('.js-notes').toggle()
  $(this).text(function (i, v) {
    return v === 'Add note' ? 'Cancel note' : 'Add note'
  })
})

$('.js-save-note').click(function () {
  $('.js-notes').hide()
  $('.js-add-note').text(function (i, v) {
    return v === 'Add note' ? 'Cancel note' : 'Add note'
  })
  $('.case-notes-results tbody').prepend('<tr><td>Joe Bloggs</td><td>31/10/2016</td><td>New note added</td><td>' + $('#case-note').val() + '</td></tr>')
  $('#case-note').val('')
})

// Set dates dynamically so they stay useful throughout prototyping
$('.date').each(function () {
  var days = $(this).data('days')
  var currentTime = new Date()
  currentTime.setDate(currentTime.getDate() + days)
  var month = currentTime.getMonth() + 1
  var day = currentTime.getDate()
  var year = currentTime.getFullYear()
  $(this).text(day + '/' + month + '/' + year)
})

if (document.location.href.indexOf('overview') > -1) {
  $('.overview')
    .show()
    .click(function (e) {
      e.preventDefault()
      document.location.href = location.href.replace(/&?overview/, '')
    })
} else {
  $('.action').show()
}

// Decision validation

$('#form-decision').submit(function (e) {
  if ($('#decisionDetails').val() == 'error') {
    e.preventDefault()
    $('.error-example').show()
    //$('.error-will-be-checked').click();
    //$('.will-be-error').removeClass('will-be-error').addClass('error');
    $('html,body').scrollTop(0)
    //$('.tag--risk').show();
  }
})

$('.error-link').click(function (e) {
  $('.business-details').click()
});

// Show/hide password
(function ($) {
  $.toggleShowPassword = function (options) {
    var settings = $.extend({
      field: '#password',
      control: '#toggle_show_password',
    }, options)

    var control = $(settings.control)
    var field = $(settings.field)

    control.bind('click', function () {
      if (control.is(':checked')) {
        field.attr('type', 'text')
      } else {
        field.attr('type', 'password')
      }
    })
  }
}(jQuery))

//Here how to call above plugin from everywhere in your application document body
$.toggleShowPassword({
  field: '#password',
  control: '#showpassword'
})
