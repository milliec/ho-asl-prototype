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

// Passing data into a page
router.get('/examples/template-data', function (req, res) {
    res.render('examples/template-data', { 'name': 'Foo' })
})

// Branching
router.get('/examples/over-18', function (req, res) {
    // Get the answer from the query string (eg. ?over18=false)
    var over18 = req.query.over18

    if (over18 === 'false') {
        // Redirect to the relevant page
        res.redirect('/docs/examples/under-18')
    } else {
        // If over18 is any other value (or is missing) render the page requested
        res.render('examples/over-18')
    }
})

// Add items to list
$(document).on('click', '.button-add-another-vertical', function (e) {
    e.preventDefault();
    var beforeThis = $(this).parents('.list-item-wrapper-vertical').find('.grid-row').last();
    $(beforeThis).before(
        '<div class="grid-row">' +
        '<div class="column-two-thirds">' +
        '<div class="form-group-compound">' +
        '<h2 class="heading-medium">Item 1</h2>' +
        '<div class="form-group">' +
        '<label class="form-label" for="field-1">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-1" name="field-1">' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label" for="field-2">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-2" name="field-2">' +
        '</div>' +
        '<div class="form-group">' +
        '<label class="form-label" for="field-3">' +
        'Field label' +
        '</label>' +
        '<input type="text" class="form-control" id="field-3" name="field-3">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="column-one-third">' +
        '</div>' +
        '</div>' +
        '<hr />'
    );
    sortFieldsVertical();
});

function sortFieldsVertical() {
    var listCounter = 1;
    var inputCounter = 1;

    $(document).find('.list-item-wrapper-vertical .grid-row').each(function () {
        $(this).find('h2').text('Item ' + listCounter);

        if ($(this).find('.remove-list-item-vertical').length === 0) {
            $(this).find('.column-one-third:last').append('<a id="remove-item-vertical-' + listCounter + '" class="remove-list-item-vertical" href="#">Remove this</a>');
        } else {
            $(this).find('.remove-list-item-vertical').attr('id', 'remove-item-vertical-' + listCounter);
        }

        $(this).find('label').each(function () {
            $(this).attr('for', 'field-' + inputCounter);
            inputCounter++;
        });

        $(this).find('input').each(function () {
            var labelNo = $(this).parent().find('label').attr('for').split('-').pop();
            $(this).attr('id', 'field-' + labelNo);
            $(this).attr('name', 'field-' + labelNo);
        });

        listCounter++;
    });

    if ($(document).find('.list-item-wrapper-vertical .grid-row').length === 2) {
        $('.remove-list-item-vertical').remove();
    }
}

$(document).on('click', '.remove-list-item-vertical', function (e) {
    e.preventDefault();
    $(this).parents('.grid-row').prev('hr').remove();
    $(this).parents('.grid-row').remove();
    sortFieldsVertical();
});

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

// Set dates dynamically so they stay useful throughout prototyping
$('.date').each(function() {
    var days = $(this).data('days');
    var currentTime = new Date();
    currentTime.setDate(currentTime.getDate()+days);
    var month = currentTime.getMonth()+1;

    var months = [ "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December", "January" ];

    var monthName = months[month];

    var day = currentTime.getDate();
    //var year = currentTime.getFullYear();
    // Fix for quirk where wrong year was shown - we only use current years so hardcoded:
    year = 2017;
    $(this).text(day + " " + monthName + " " + year);
});

/////// USERS TYPEAHEAD
// storing in a JSON file wasn't working consistently so I've moved here
var users = ["Site 1","Site 2","Site 3","Site 4","Site 5","Site 6","Site 7"];

$('.user-typeahead').typeahead({
        hint: true,
        highlight: true,
        minLength: 3
    },
    {
        name: 'users',
        source: substringMatcher(users),
        templates: {
            empty: [
                '<p class="tt-suggestion">No matches found - please search again</p>'].join('\n')
        }
    });


//branching
var TAXES = ['Self Assessment (SA)', 'Submit VAT Returns', 'Corporation Tax (CT)'];

function interpolate(t, o, s) {
    var m = (!s) ? /{([^{}]*)}/g : s;
    if (s) m = s;
    return t.replace(m, function (a, b) {
        var newLine = b.indexOf('|');
        b = newLine > -1 ? b.split('|')[0] : b;
        var r = o[b];
        if (Array.isArray(r)) {
            return newLine > -1 ? r.join('<br/>') : r;
        } else if (typeof r === 'string' || typeof r === 'number' || typeof r === 'boolean')
            return r;
        else return a;
    });
}

function getQueryParams() {
    var params = [];
    var hash = location.search.replace('?', '');
    if (hash.length > -1) {
        hash.split('&').forEach(function (param) {
            if (param) {
                var parts = param.split('=');
                var value = parts[1];
                if (value.indexOf('[') > -1 && value.indexOf(']') > -1) {
                    value = value.replace('[', '').replace(']', '').split(',');
                }
                params.push({name: parts[0], value: value});
            }
        });
    }
    return params;
}

function formParam(paramName) {
    var queryParams = getQueryParams();
    for (var i = 0; i < queryParams.length; i++) {
        if (queryParams[i].name === paramName) {
            return uriDecodePreserveNewLines(queryParams[i].value);
        }
    }
}

function uriDecodePreserveNewLines(value) {
    return decodeURI(value)
        .replace(/\+/g, ' ')
        .replace(/\n/g, '<br/>');
}

function toQueryParams(array) {
    if (!array) return '';
    if (!Array.isArray(array)) array = [array];
    return array.map(function (item) {
        return item.name + '=' + item.value;
    }).join('&');
}

function toObject(array) {
    return array.reduce(function (acc, item) {
        var prop = acc[item.name];
        if (prop) {
            if (Array.isArray(prop)) {
                prop.push(item.value);
            } else {
                acc[item.name] = [prop, item.value];
            }
        } else {
            acc[item.name] = item.value;
        }
        return acc;
    }, {});
}

function serializeFormArray(formName) {
    formName = formName || 'aspnetForm';
    return $('form[name=' + formName + ']').serializeArray();
}

function redirectTo(nextUrl, params) {
    var newUrl,
        $forms = $('form[name="aspnetForm"]'),
        parts = location.pathname.split('/');

    parts.pop();

    queryParams = toQueryParams(params);
    newUrl = location.origin + parts.join('/') + '/' + nextUrl + (nextUrl.indexOf('?') === -1 ? '?' + queryParams : queryParams);
    if ($forms.length > 0) $forms.off('submit');
    location = newUrl;
    return false;
}

function postTo(nextUrl, formName) {
    var params = getQueryParams();
    params = params.concat(serializeFormArray(formName));
    return redirectTo(nextUrl, params);
}

function createService(nextUrl) {
    var record = toObject(serializeFormArray());
    localStorage.setItem('services', JSON.stringify(record));
    return redirectTo(nextUrl);
}

function removeService(nextUrl) {
    var formData = toObject(serializeFormArray());
    var store = localStorage.getItem('services');
    var record = store ? JSON.parse(store) : {data: []};
    record.data.splice(formData.index, 1);
    localStorage.setItem('services', JSON.stringify(record));
    return redirectTo(nextUrl);
}

function getId() {
    return Math.floor(Math.random() * 9000) + 1000;
}

function createUser(nextUrl, forwardParams, formName) {
    var queryparams = getActionFromQueryParam();
    var store = localStorage.getItem('users');
    var data = store ? JSON.parse(store) : [];
    var record = toObject(serializeFormArray(formName));
    record.id = [getId(), getId(), getId()].join(' ');
    record.twofactor = 'false';
    record.loggedIn = 'false';
    record.services = TAXES;
    data.push(record);
    localStorage.setItem('users', JSON.stringify(data));

    if (queryparams.length === 0) queryparams = [{name: 'action', value: 'create'}];
    queryparams.push({name: 'id', value: record.id});

    if (forwardParams) {
        if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
        forwardParams.forEach(function (param) {
            queryparams.push({name: param, value: record[param]});
        });
    }

    return redirectTo(nextUrl, queryparams);
}

function updateUser(nextUrl, forwardParams, isService) {
    var queryparams = getActionFromQueryParam();
    var store = localStorage.getItem('users');
    var data = store ? JSON.parse(store) : [];
    var record = toObject(serializeFormArray());
    if (isService) {
        record.services = record.services || [];
    }
    if (record.services && !Array.isArray(record.services)) {
        record.services = [record.services];
    }
    if (record.id && data.length > 0) {
        data.some(function (rec) {
            if (rec.id == record.id) {
                $.extend(rec, record);
                return true;
            }
            return false;
        });
    }
    localStorage.setItem('users', JSON.stringify(data));

    if (queryparams.length === 0) queryparams = [{name: 'action', value: 'update'}];
    queryparams.push({name: 'id', value: record.id});

    if (forwardParams) {
        if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
        forwardParams.forEach(function (param) {
            queryparams.push({name: param, value: record[param]});
        });
    }
    return redirectTo(nextUrl, queryparams);
}

function deleteUser(nextUrl, forwardParams, formName) {
    var queryparams = [];
    var store = localStorage.getItem('users');
    var data = store ? JSON.parse(store) : [];
    var record = toObject(serializeFormArray(formName));
    if (record.id && data.length > 0) {
        var recIndex = -1;
        data.some(function (rec, index) {
            if (rec.id == record.id) {
                recIndex = index;
                return true;
            }
            return false;
        });
        if (recIndex > -1) data.splice(recIndex, 1);
    }

    localStorage.setItem('users', JSON.stringify(data));

    if (queryparams.length === 0) queryparams = [{name: 'action', value: 'delete'}];
    queryparams.push({name: 'id', value: record.id});

    if (forwardParams) {
        if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
        forwardParams.forEach(function (param) {
            queryparams.push({name: param, value: record[param]});
        });
    }

    return redirectTo(nextUrl, queryparams);
}

function resetSecurity(nextUrl, forwardParams, formName) {
    var queryparams = [];
    var store = localStorage.getItem('users');
    var data = store ? JSON.parse(store) : [];
    var record = toObject(serializeFormArray(formName));
    if (record.id && data.length > 0) {
        data.some(function (rec, index) {
            if (rec.id == record.id) {
                rec.twofactor = 'false';
                return true;
            }
            return false;
        });
    }

    localStorage.setItem('users', JSON.stringify(data));

    if (queryparams.length === 0) queryparams = [{name: 'action', value: 'reset-security'}];
    queryparams.push({name: 'id', value: record.id});

    if (forwardParams) {
        if (!Array.isArray(forwardParams)) forwardParams = [forwardParams];
        forwardParams.forEach(function (param) {
            queryparams.push({name: param, value: record[param]});
        });
    }

    return redirectTo(nextUrl, queryparams);
}

function conditionalNavigation(input, value, nextUrl, alternativeUrl) {
    var form = serializeFormArray();
    form.forEach(function (item) {
        if (item.name === input) {
            if (item.value == value) {
                return redirectTo(nextUrl, form);
            } else {
                return redirectTo(alternativeUrl, form);
            }
        }
    });
}

function multiNavigation(input, values, urls) {
    var form = serializeFormArray();
    form.forEach(function (item) {
        if (item.name === input) {
            for(var i = 0; i < values.length; i++) {
                if (item.value == values[i]) {
                    return redirectTo(urls[i], form);
                }
            }
        }
    });
}

function validateForm(event) {
    event.preventDefault();
    var noErrors = true;
    var summary = $('[name=aspnetForm] .error-summary');
    if (summary.length > 0) return $('[name=aspnetForm]').valid();

    $('[name=aspnetForm] input').each(function () {
        var input = $(this);
        var name = input.attr('name');
        if (!input.val().length) {
            input.closest('.form-field').addClass('form-field--error');
            input.addClass('error-field');
            noErrors = false;
        } else {
            input.closest('.form-field').removeClass('form-field--error');
            input.removeClass('error-field');
        }
    });

    return !!noErrors;
}

function getActionFromQueryParam() {
    return getQueryParams().filter(function (param) {
        return param.name === 'action';
    });
}

function checkMode(mode) {
    return getQueryParams().some(function (param) {
        return param.name === 'mode' && param.value === mode;
    });
}

function addUser(record) {
    var store = localStorage.getItem('users');
    var data = store ? JSON.parse(store) : [];
    var exist = data.some(function (rec) {
        return rec.id == record.id;
    });
    if (!exist) {
        data.push(record);
        localStorage.setItem('users', JSON.stringify(data));
    }
}

// populate query params into document
$(function () {
    document.body.className = ((document.body.className) ? document.body.className + ' js-enabled' : 'js-enabled');
    var params = getQueryParams();
    params.forEach(function (param) {

        // populate query params into document
        $('#' + param.name).text(param.value).val(param.value);
        $('.' + param.name).text(param.value).val(param.value);
        $('[name=' + param.name + ']').text(param.value).val(param.value);

        // toggle UI elements based on query params
        var toggleParams = $('[data-query-toggle-name=' + param.name + ']');
        toggleParams.each(function (index, toggleParam) {
            toggleParam = $(toggleParam);
            if (param.value == toggleParam.data('query-toggle-value')) {
                toggleParam.toggleClass('hidden');
            }
        });
    });
});

// bootstrap default user
$(function () {
    addUser({
        'fullname': 'Alex Fisher',
        'email': 'alex.fisher@gmail.com',
        'password': 'qwerty',
        'confirmPassword': 'qwerty',
        'id': '1889 5673 9873',
        'permission': 'administrator',
        'services': TAXES,
        'loggedIn': 'true',
        'twofactor': 'true'
    });

    if (location.pathname.indexOf('manage-users-reset2sv') > -1) {
        addUser({
            'fullname': 'James May',
            'email': 'james.may@gmail.com',
            'password': 'qwerty',
            'confirmPassword': 'qwerty',
            'id': '1889 5673 9871',
            'permission': 'administrator',
            'services': TAXES,
            'loggedIn': 'false',
            'twofactor': 'true'
        });
    }
});

// render local storage data
$(function () {
    var target = $('[data-render-storage]');
    var templateEl = target.find('[data-render-template]');
    var template = templateEl.prop('outerHTML');
    var storeName = target.data('render-storage');
    var store = localStorage.getItem(storeName);
    var records = store ? JSON.parse(store) : [];
    templateEl.addClass('hidden');

    if (Array.isArray(records)) {
        records.forEach(function (record) {
            target.append($(interpolate(template, record)).removeAttr('data-render-template'));
        });
    } else {
        records.data.forEach(function (record, index) {
            target.append($(interpolate(template, {'@key': record, '@index': index})).removeAttr('data-render-template'));
        });
    }

    $('[data-if]').each(function (index, element) {
        element = $(element);
        if (element.parents('[data-render-template]').length === 0) {
            if (eval(element.data('if'))) {
                element.show();
            } else {
                element.hide();
            }
        }
    });
});

$(function () {
    $('#dismissExtraSecurity').click(function (e) {
        $('#extraSecurity').hide();

        $('#mod').show();
        e.preventDefault()
    });
});

// service manual
!function (t) {
    "use strict";
    var e = t.jQuery, n = t.GOVUK || {}, o = {
        _hasScrolled: !1,
        _scrollTimeout: !1,
        _hasResized: !1,
        _resizeTimeout: !1,
        getWindowDimensions: function () {
            return {height: e(t).height(), width: e(t).width()}
        },
        getWindowPositions: function () {
            return {scrollTop: e(t).scrollTop()}
        },
        getElementOffset: function (t) {
            return t.offset()
        },
        init: function () {
            var i = e(".js-stick-at-top-when-scrolling");
            i.length > 0 && (o.$els = i, o._scrollTimeout === !1 && (e(t).scroll(o.onScroll), o._scrollTimeout = t.setInterval(o.checkScroll, 50)), o._resizeTimeout === !1 && (e(t).resize(o.onResize), o._resizeTimeout = t.setInterval(o.checkResize, 50))), n.stopScrollingAtFooter && i.each(function (o, i) {
                var s = e(i).find("img");
                if (s.length > 0) {
                    var r = new t.Image;
                    r.onload = function () {
                        n.stopScrollingAtFooter.addEl(e(i), e(i).outerHeight())
                    }, r.src = s.attr("src")
                } else n.stopScrollingAtFooter.addEl(e(i), e(i).outerHeight())
            })
        },
        onScroll: function () {
            o._hasScrolled = !0
        },
        onResize: function () {
            o._hasResized = !0
        },
        checkScroll: function () {
            if (o._hasScrolled === !0) {
                o._hasScrolled = !1;
                var t = o.getWindowPositions().scrollTop, n = o.getWindowDimensions();
                o.$els.each(function (i, s) {
                    var r = e(s), a = r.data("scrolled-from");
                    a && a > t ? o.release(r) : n.width > 768 && t >= o.getElementOffset(r).top && o.stick(r)
                })
            }
        },
        checkResize: function () {
            if (o._hasResized === !0) {
                o._hasResized = !1;
                var t = o.getWindowDimensions();
                o.$els.each(function (n, i) {
                    var s = e(i), r = s.hasClass("js-sticky-resize");
                    if (r) {
                        var a = e(".shim"), c = s.parent("div"), u = c.width();
                        a.css("width", u), s.css("width", u)
                    }
                    t.width <= 768 && o.release(s)
                })
            }
        },
        stick: function (t) {
            if (!t.hasClass("content-fixed")) {
                t.data("scrolled-from", o.getElementOffset(t).top);
                var e = Math.max(t.height(), 1);
                t.before('<div class="shim" style="width: ' + t.width() + "px; height: " + e + 'px">&nbsp;</div>'), t.css("width", t.width() + "px").addClass("content-fixed")
            }
        },
        release: function (t) {
            t.hasClass("content-fixed") && (t.data("scrolled-from", !1), t.removeClass("content-fixed").css("width", ""), t.siblings(".shim").remove())
        }
    };
    n.stickAtTopWhenScrolling = o, t.GOVUK = n
}(window), function (t) {
    "use strict";
    var e = t.jQuery, n = t.GOVUK || {}, o = {
        _pollingId: null,
        _isPolling: !1,
        _hasScrollEvt: !1,
        _els: [],
        addEl: function (n, i) {
            var s;
            if (n.length) {
                s = parseInt(n.css("top"), 10), s = isNaN(s) ? 0 : s, o.updateFooterTop(), e(t).on("govuk.pageSizeChanged", o.updateFooterTop);
                var r = e("<div></div>");
                r.insertBefore(n);
                var a = r.offset().top - r.position().top;
                r.remove();
                var c = {$fixedEl: n, height: i + s, fixedTop: i + a, state: "fixed"};
                o._els.push(c), o.initTimeout()
            }
        },
        updateFooterTop: function () {
            var t = e(".js-footer:eq(0)");
            return 0 === t.length ? 0 : void(o.footerTop = t.offset().top - 10)
        },
        initTimeout: function () {
            o._hasScrollEvt === !1 && (e(window).scroll(o.onScroll), o._hasScrollEvt = !0)
        },
        onScroll: function () {
            o._isPolling === !1 && o.startPolling()
        },
        startPolling: function () {
            return window.requestAnimationFrame ? function () {
                var t = function () {
                    o.checkScroll(), o._isPolling === !0 && o.startPolling()
                };
                o._pollingId = window.requestAnimationFrame(t), o._isPolling = !0
            } : function () {
                o._pollingId = window.setInterval(o.checkScroll, 16), o._isPolling = !0
            }
        }(),
        stopPolling: function () {
            return window.requestAnimationFrame ? function () {
                window.cancelAnimationFrame(o._pollingId), o._isPolling = !1
            } : function () {
                window.clearInterval(o._pollingId), o._isPolling = !1
            }
        }(),
        checkScroll: function () {
            var t = e(window).scrollTop();
            return t < o.cachedScrollTop + 2 && t > o.cachedScrollTop - 2 ? void o.stopPolling() : (o.cachedScrollTop = t, void e.each(o._els, function (e, n) {
                var i = t + n.height;
                i > o.footerTop ? o.stick(n) : o.unstick(n)
            }))
        },
        stick: function (t) {
            "fixed" === t.state && "fixed" === t.$fixedEl.css("position") && (t.$fixedEl.css({
                position: "absolute",
                top: o.footerTop - t.fixedTop
            }), t.state = "absolute")
        },
        unstick: function (t) {
            "absolute" === t.state && (t.$fixedEl.css({position: "", top: ""}), t.state = "fixed")
        }
    };
    n.stopScrollingAtFooter = o, e(t).load(function () {
        e(t).trigger("govuk.pageSizeChanged")
    }), t.GOVUK = n
}(window), function (t) {
    "use strict";
    t.GOVUK = t.GOVUK || {}, t.GOVUK.getCurrentLocation = function () {
        return t.location
    }
}(window), function (t, e) {
    "use strict";
    e.GOVUK = e.GOVUK || {}, GOVUK.Modules = GOVUK.Modules || {}, GOVUK.modules = {
        find: function (e) {
            var n, o = "[data-module]", e = e || t("body");
            return n = e.find(o), e.is(o) && (n = n.add(e)), n
        }, start: function (e) {
            function n(t) {
                return i(o(t))
            }

            function o(t) {
                return t.replace(/-([a-z])/g, function (t) {
                    return t[1].toUpperCase()
                })
            }

            function i(t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            }

            for (var s = this.find(e), r = 0, a = s.length; a > r; r++) {
                var c, u = t(s[r]), l = n(u.data("module")), d = u.data("module-started");
                "function" != typeof GOVUK.Modules[l] || d || (c = new GOVUK.Modules[l], c.start(u), u.data("module-started", !0))
            }
        }
    }
}(jQuery, window), function (t) {
    "use strict";
    t.AccordionWithDescriptions = function () {
        this.start = function (t) {
            function e() {
                return $("h1").text()
            }

            function n(t) {
                return t.replace(/\s+/g, "_")
            }

            function o() {
                var t = e();
                return t = n(t), t = t.toLowerCase(), "GOVUK_service_manual_" + t + "_"
            }

            function i() {
                t.prepend('<div class="subsection-controls js-subsection-controls"><button aria-expanded="false">Open all</button></div>')
            }

            function s() {
                var e = t.find(".subsection__title");
                e.each(function (t) {
                    $(this).wrapInner('<button class="subsection__button js-subsection-button" aria-expanded="false" aria-controls="subsection_content_' + t + '"></a>')
                })
            }

            function r() {
                F.append('<span class="subsection__icon"></span>')
            }

            function a() {
                for (var e = "", n = 0; P > n; n++)e += "subsection_content_" + n + " ";
                C = t.find(".js-subsection-controls button"), C.attr("aria-controls", e)
            }

            function c() {
                var e = t.find(".subsection__content");
                S(e)
            }

            function u() {
                var e, n = l();
                n.length && (e = t.find(n).parents(".subsection").find(".subsection__content"), e.length && _(e))
            }

            function l() {
                return GOVUK.getCurrentLocation().hash
            }

            function d() {
                var e = t.find(".subsection__content");
                e.each(function (t) {
                    var e = $(this).attr("id");
                    sessionStorage.getItem(U + e) && m($("#" + e))
                }), v()
            }

            function f() {
                var t = $(".subsection--is-open").length;
                if (t) {
                    var e = $(".subsection--is-open");
                    e.each(function (t) {
                        var e = $(this).find(".subsection__content").attr("id");
                        sessionStorage.setItem(U + e, "Opened")
                    })
                }
            }

            function h() {
                var t = $(".subsection").length;
                if (t) {
                    var e = $(".subsection");
                    e.each(function (t) {
                        var e = $(this).find(".subsection__content").attr("id");
                        sessionStorage.removeItem(U + e, e)
                    })
                }
            }

            function g() {
                F.on("click", function (t) {
                    return b($(this).next()), k($(this)), w($(this).find(".subsection__button")), v(), f(), h(), !1
                }), I.on("click", function (t) {
                    return b($(this).parent().parent().next()), k($(this).parent().parent()), w($(this)), v(), f(), h(), !1
                })
            }

            function p() {
                C = t.find(".js-subsection-controls button"), C.on("click", function (e) {
                    var n = "";
                    return "Open all" == C.text() ? (C.text("Close all"), C.attr("aria-expanded", "true"), n = "open") : (C.text("Open all"), C.attr("aria-expanded", "false"), n = "close"), t.find(".js-subsection").each(function () {
                        var t = $(this), e = t.find(".js-subsection-button"), o = t.find(".js-subsection-content");
                        "open" == n ? (e.attr("aria-expanded", "true"), o.removeClass("js-hidden"), t.removeClass("subsection"), t.addClass("subsection--is-open")) : (e.attr("aria-expanded", "false"), o.addClass("js-hidden"), t.addClass("subsection"), t.removeClass("subsection--is-open"))
                    }), f(), h(), !1
                })
            }

            function m(t) {
                b(t), k(t), w(t.parent().find(".subsection__button")), v()
            }

            function v() {
                var t = $(".subsection--is-open").length;
                t === P ? C.text("Close all") : C.text("Open all")
            }

            function b(t) {
                $(t).hasClass("js-hidden") ? _(t) : S(t)
            }

            function k(t) {
                $(t).parent().hasClass("subsection--is-open") ? (t.parent().removeClass("subsection--is-open"), t.parent().addClass("subsection")) : (t.parent().removeClass("subsection"), t.parent().addClass("subsection--is-open"))
            }

            function w(t) {
                "true" == $(t).attr("aria-expanded") ? t.attr("aria-expanded", "false") : t.attr("aria-expanded", "true")
            }

            function _(t) {
                t.removeClass("js-hidden")
            }

            function S(t) {
                t.addClass("js-hidden")
            }

            t.addClass("js-accordion-with-descriptions"), t.removeClass("js-hidden");
            var C, I = t.find(".subsection__button"), F = t.find(".subsection__header"), P = t.find(".subsection__content").length, U = o();
            i(), s(), r(), a(), c(), d(), u(), g(), p()
        }
    }
}(window.GOVUK.Modules), function (t, e) {
    "use strict";
    var n = e.$, o = n(e);
    t.HighlightActiveSectionHeading = function () {
        var t = this, e = !0, i = !0, s = 50, r = [];
        t.getWindowDimensions = function () {
            return {height: o.height(), width: o.width()}
        }, t.getWindowPositions = function () {
            return {scrollTop: o.scrollTop()}
        }, t.getElementOffset = function (t) {
            return t.offset()
        }, t.start = function (e) {
            o.resize(t.hasResized), o.scroll(t.hasScrolled), setInterval(t.checkResize, s), setInterval(t.checkScroll, s), t.$anchors = e.find(".js-page-contents a"), t.getAnchors(), t.checkResize(), t.checkScroll()
        }, t.hasResized = function () {
            return e = !0
        }, t.hasScrolled = function () {
            return i = !0
        }, t.checkResize = function () {
            e && (e = !1, i = !0)
        }, t.checkScroll = function () {
            if (i) {
                i = !1;
                var e = t.getWindowDimensions();
                e.width <= 768 ? t.removeActiveItem() : t.updateActiveNavItem()
            }
        }, t.getAnchors = function () {
            n.each(t.$anchors, function (t) {
                var e = n(this).attr("href");
                r.push(e)
            })
        }, t.getHeadingPosition = function (t) {
            return t.offset()
        }, t.getNextHeadingPosition = function (t) {
            return t.offset()
        }, t.getFooterPosition = function (t) {
            return t.offset()
        }, t.getDistanceBetweenHeadings = function (t, e) {
            var n = e - t;
            return n
        }, t.updateActiveNavItem = function () {
            var e = t.getWindowPositions().scrollTop, o = t.getFooterPosition(n("#footer"));
            n.each(t.$anchors, function (i) {
                var s = r[i], a = r[i + 1], c = n(s), u = n(a), l = t.getHeadingPosition(c);
                if (l) {
                    if (l = l.top, l -= 53, a)var d = t.getNextHeadingPosition(u).top;
                    var f = t.getDistanceBetweenHeadings(l, d);
                    if (f)var h = e >= l && l + f > e; else var h = e >= l && e < o.top;
                    h && t.setActiveItem(s)
                }
            })
        }, t.setActiveItem = function (e) {
            t.$anchors.removeClass("active"), t.$anchors.filter("[href='" + e + "']").addClass("active")
        }, t.removeActiveItem = function () {
            t.$anchors.removeClass("active")
        }
    }
}(window.GOVUK.Modules, window), function (t) {
    "use strict";
    function e() {
        this.controller = null, this.view = null, this.start = function (t) {
            this.view = new n(t), this.controller = new o(this.view), this.controller.init()
        }
    }

    function n(t) {
        function e(t) {
            return function (e) {
                e.preventDefault(), t()
            }
        }

        var n = this;
        this.$pageIsUsefulButton = t.find(".js-page-is-useful"), this.$pageIsNotUsefulButton = t.find(".js-page-is-not-useful"), this.$somethingIsWrongButton = t.find(".js-something-is-wrong"), this.$feedbackFormContainer = t.find(".js-feedback-form"), this.$feedbackForm = n.$feedbackFormContainer.find("form"), this.$feedbackFormSubmitButton = n.$feedbackFormContainer.find("[type=submit]"), this.$prompt = t.find(".js-prompt"), this.onPageIsUsefulButtonClicked = function (t) {
            n.$pageIsUsefulButton.on("click", e(t))
        }, this.onPageIsNotUsefulButtonClicked = function (t) {
            n.$pageIsNotUsefulButton.on("click", e(t))
        }, this.onSomethingIsWrongButtonClicked = function (t) {
            n.$somethingIsWrongButton.on("click", e(t))
        }, this.onSubmitFeedbackForm = function (t) {
            n.$feedbackForm.on("submit", e(t))
        }, this.replaceWithSuccess = function () {
            t.html("Thanks for your feedback.")
        }, this.replaceWithGenericError = function () {
            t.html('Sorry, we\u2019re unable to receive your message right now. We have other ways for you to provide feedback on the <a href="/contact/govuk">contact page</a>.')
        }, this.showFeedbackForm = function () {
            n.$prompt.addClass("js-hidden"), n.$feedbackFormContainer.removeClass("js-hidden")
        }, this.feedbackFormContainerData = function () {
            return n.$feedbackFormContainer.find("input, textarea").serialize()
        }, this.feedbackFormContainerTrackEventParams = function () {
            return n.getTrackEventParams(n.$feedbackFormContainer)
        }, this.pageIsUsefulTrackEventParams = function () {
            return n.getTrackEventParams(n.$pageIsUsefulButton)
        }, this.pageIsNotUsefulTrackEventParams = function () {
            return n.getTrackEventParams(n.$pageIsNotUsefulButton)
        }, this.somethingIsWrongTrackEventParams = function () {
            return n.getTrackEventParams(n.$somethingIsWrongButton)
        }, this.getTrackEventParams = function (t) {
            return {category: t.data("track-category"), action: t.data("track-action")}
        }, this.renderErrors = function (t) {
            n.$feedbackFormContainer.find(".js-error").remove(), $.each(t, function (t, e) {
                $.each(e, function (e, o) {
                    var i = $("<div/>", {
                        "class": "improve-this-page__error js-error",
                        text: t + " " + o + "."
                    }), s = n.$feedbackFormContainer.find('[name="' + t + '"]');
                    s.length ? s.before(i) : n.$feedbackFormContainer.find(".js-errors").append(i)
                })
            })
        }, this.disableSubmitFeedbackButton = function () {
            n.$feedbackFormSubmitButton.prop("disabled", !0)
        }, this.enableSubmitFeedbackButton = function () {
            n.$feedbackFormSubmitButton.removeAttr("disabled")
        }
    }

    function o(t) {
        var e = this;
        this.init = function () {
            e.bindPageIsUsefulButton(), e.bindPageIsNotUsefulButton(), e.bindSomethingIsWrongButton(), e.bindSubmitFeedbackButton()
        }, this.bindPageIsUsefulButton = function () {
            var n = function () {
                e.trackEvent(t.pageIsUsefulTrackEventParams()), t.replaceWithSuccess()
            };
            t.onPageIsUsefulButtonClicked(n)
        }, this.bindPageIsNotUsefulButton = function () {
            var n = function () {
                e.trackEvent(t.pageIsNotUsefulTrackEventParams()), t.showFeedbackForm()
            };
            t.onPageIsNotUsefulButtonClicked(n)
        }, this.bindSomethingIsWrongButton = function () {
            var n = function () {
                e.trackEvent(t.somethingIsWrongTrackEventParams()), t.showFeedbackForm()
            };
            t.onSomethingIsWrongButtonClicked(n)
        }, this.bindSubmitFeedbackButton = function () {
            t.onSubmitFeedbackForm(e.handleSubmitFeedback)
        }, this.handleSubmitFeedback = function () {
            $.ajax({
                type: "POST",
                url: "/contact/govuk/page_improvements",
                data: t.feedbackFormContainerData(),
                beforeSend: t.disableSubmitFeedbackButton
            }).done(function () {
                e.trackEvent(t.feedbackFormContainerTrackEventParams()), t.replaceWithSuccess()
            }).fail(function (e) {
                422 == e.status ? (t.renderErrors(e.responseJSON.errors), t.enableSubmitFeedbackButton()) : t.replaceWithGenericError()
            })
        }, this.trackEvent = function (t) {
            GOVUK.analytics && GOVUK.analytics.trackEvent && GOVUK.analytics.trackEvent(t.category, t.action)
        }
    }

    t.ImproveThisPage = e
}(window.GOVUK.Modules), $(document).ready(function () {
    GOVUK.modules.start()
}), window.GOVUK.stickAtTopWhenScrolling.init(), window.GOVUK.stopScrollingAtFooter.addEl($(".js-stick-at-top-when-scrolling"));

// // auto-complete
// !function (e, t) {'object' == typeof exports && 'object' == typeof module ? module.exports = t() : 'function' == typeof define && define.amd ? define([], t) : 'object' == typeof exports ? exports.accessibleAutocomplete = t() : e.accessibleAutocomplete = t()}(this, function () {
//   return function (e) {
//     function t (o) {
//       if (n[o]) return n[o].exports
//       var r = n[o] = {i: o, l: !1, exports: {}}
//       return e[o].call(r.exports, r, r.exports, t), r.l = !0, r.exports
//     }
//
//     var n = {}
//     return t.m = e, t.c = n, t.d = function (e, n, o) {
//       t.o(e, n) || Object.defineProperty(e, n, {
//         configurable: !1,
//         enumerable: !0,
//         get: o
//       })
//     }, t.n = function (e) {
//       var n = e && e.__esModule ? function () {return e.default} : function () {return e}
//       return t.d(n, 'a', n), n
//     }, t.o = function (e, t) {return Object.prototype.hasOwnProperty.call(e, t)}, t.p = '/', t(t.s = 1)
//   }([function (e, t, n) {
//     !function () {
//       'use strict'
//
//       function t () {}
//
//       function n (e, n) {
//         var o, r, l, i, u = L
//         for (i = arguments.length; i-- > 2;) D.push(arguments[i])
//         for (n && null != n.children && (D.length || D.push(n.children), delete n.children); D.length;) if ((r = D.pop()) && void 0 !== r.pop) for (i = r.length; i--;) D.push(r[i]) else !0 !== r && !1 !== r || (r = null), (l = 'function' != typeof e) && (null == r ? r = '' : 'number' == typeof r ? r = String(r) : 'string' != typeof r && (l = !1)), l && o ? u[u.length - 1] += r : u === L ? u = [r] : u.push(r), o = l
//         var s = new t
//         return s.nodeName = e, s.children = u, s.attributes = null == n ? void 0 : n, s.key = null == n ? void 0 : n.key, void 0 !== A.vnode && A.vnode(s), s
//       }
//
//       function o (e, t) {
//         for (var n in t) e[n] = t[n]
//         return e
//       }
//
//       function r (e, t) {return n(e.nodeName, o(o({}, e.attributes), t), arguments.length > 2 ? [].slice.call(arguments, 2) : e.children)}
//
//       function l (e) {!e.__d && (e.__d = !0) && 1 == V.push(e) && (A.debounceRendering || setTimeout)(i)}
//
//       function i () {
//         var e, t = V
//         for (V = []; e = t.pop();) e.__d && N(e)
//       }
//
//       function u (e, t, n) {return 'string' == typeof t || 'number' == typeof t ? void 0 !== e.splitText : 'string' == typeof t.nodeName ? !e._componentConstructor && s(e, t.nodeName) : n || e._componentConstructor === t.nodeName}
//
//       function s (e, t) {return e.__n === t || e.nodeName.toLowerCase() === t.toLowerCase()}
//
//       function a (e) {
//         var t = o({}, e.attributes)
//         t.children = e.children
//         var n = e.nodeName.defaultProps
//         if (void 0 !== n) for (var r in n) void 0 === t[r] && (t[r] = n[r])
//         return t
//       }
//
//       function p (e, t) {
//         var n = t ? document.createElementNS('http://www.w3.org/2000/svg', e) : document.createElement(e)
//         return n.__n = e, n
//       }
//
//       function c (e) {e.parentNode && e.parentNode.removeChild(e)}
//
//       function d (e, t, n, o, r) {
//         if ('className' === t && (t = 'class'), 'key' === t)  else if ('ref' === t) n && n(null), o && o(e) else if ('class' !== t || r) if ('style' === t) {
//           if (o && 'string' != typeof o && 'string' != typeof n || (e.style.cssText = o || ''), o && 'object' == typeof o) {
//             if ('string' != typeof n) for (var l in n) l in o || (e.style[l] = '')
//             for (var l in o) e.style[l] = 'number' == typeof o[l] && !1 === T.test(l) ? o[l] + 'px' : o[l]
//           }
//         } else if ('dangerouslySetInnerHTML' === t) o && (e.innerHTML = o.__html || '') else if ('o' == t[0] && 'n' == t[1]) {
//           var i = t !== (t = t.replace(/Capture$/, ''))
//           t = t.toLowerCase().substring(2), o ? n || e.addEventListener(t, h, i) : e.removeEventListener(t, h, i), (e.__l || (e.__l = {}))[t] = o
//         } else if ('list' !== t && 'type' !== t && !r && t in e) f(e, t, null == o ? '' : o), null != o && !1 !== o || e.removeAttribute(t) else {
//           var u = r && t !== (t = t.replace(/^xlink\:?/, ''))
//           null == o || !1 === o ? u ? e.removeAttributeNS('http://www.w3.org/1999/xlink', t.toLowerCase()) : e.removeAttribute(t) : 'function' != typeof o && (u ? e.setAttributeNS('http://www.w3.org/1999/xlink', t.toLowerCase(), o) : e.setAttribute(t, o))
//         } else e.className = o || ''
//       }
//
//       function f (e, t, n) {try {e[t] = n} catch (e) {}}
//
//       function h (e) {return this.__l[e.type](A.event && A.event(e) || e)}
//
//       function m () {for (var e; e = R.pop();) A.afterMount && A.afterMount(e), e.componentDidMount && e.componentDidMount()}
//
//       function _ (e, t, n, o, r, l) {
//         q++ || (P = null != r && void 0 !== r.ownerSVGElement, U = null != e && !('__preactattr_' in e))
//         var i = v(e, t, n, o, l)
//         return r && i.parentNode !== r && r.appendChild(i), --q || (U = !1, l || m()), i
//       }
//
//       function v (e, t, n, o, r) {
//         var l = e, i = P
//         if (null == t && (t = ''), 'string' == typeof t) return e && void 0 !== e.splitText && e.parentNode && (!e._component || r) ? e.nodeValue != t && (e.nodeValue = t) : (l = document.createTextNode(t), e && (e.parentNode && e.parentNode.replaceChild(l, e), g(e, !0))), l.__preactattr_ = !0, l
//         if ('function' == typeof t.nodeName) return S(e, t, n, o)
//         if (P = 'svg' === t.nodeName || 'foreignObject' !== t.nodeName && P, (!e || !s(e, String(t.nodeName))) && (l = p(String(t.nodeName), P), e)) {
//           for (; e.firstChild;) l.appendChild(e.firstChild)
//           e.parentNode && e.parentNode.replaceChild(l, e), g(e, !0)
//         }
//         var u = l.firstChild, a = l.__preactattr_ || (l.__preactattr_ = {}), c = t.children
//         return !U && c && 1 === c.length && 'string' == typeof c[0] && null != u && void 0 !== u.splitText && null == u.nextSibling ? u.nodeValue != c[0] && (u.nodeValue = c[0]) : (c && c.length || null != u) && y(l, c, n, o, U || null != a.dangerouslySetInnerHTML), w(l, t.attributes, a), P = i, l
//       }
//
//       function y (e, t, n, o, r) {
//         var l, i, s, a, p = e.childNodes, d = [], f = {}, h = 0, m = 0, _ = p.length, y = 0, b = t ? t.length : 0
//         if (0 !== _) for (var w = 0; w < _; w++) {
//           var O = p[w], C = O.__preactattr_, x = b && C ? O._component ? O._component.__k : C.key : null
//           null != x ? (h++, f[x] = O) : (C || (void 0 !== O.splitText ? !r || O.nodeValue.trim() : r)) && (d[y++] = O)
//         }
//         if (0 !== b) for (var w = 0; w < b; w++) {
//           s = t[w], a = null
//           var x = s.key
//           if (null != x) h && void 0 !== f[x] && (a = f[x], f[x] = void 0, h--) else if (!a && m < y) for (l = m; l < y; l++) if (void 0 !== d[l] && u(i = d[l], s, r)) {
//             a = i, d[l] = void 0, l === y - 1 && y--, l === m && m++
//             break
//           }
//           (a = v(a, s, n, o)) && a !== e && (w >= _ ? e.appendChild(a) : a !== p[w] && (a === p[w + 1] ? c(p[w]) : e.insertBefore(a, p[w] || null)))
//         }
//         if (h) for (var w in f) void 0 !== f[w] && g(f[w], !1)
//         for (; m <= y;) void 0 !== (a = d[y--]) && g(a, !1)
//       }
//
//       function g (e, t) {
//         var n = e._component
//         n ? I(n) : (null != e.__preactattr_ && e.__preactattr_.ref && e.__preactattr_.ref(null), !1 !== t && null != e.__preactattr_ || c(e), b(e))
//       }
//
//       function b (e) {
//         for (e = e.lastChild; e;) {
//           var t = e.previousSibling
//           g(e, !0), e = t
//         }
//       }
//
//       function w (e, t, n) {
//         var o
//         for (o in n) t && null != t[o] || null == n[o] || d(e, o, n[o], n[o] = void 0, P)
//         for (o in t) 'children' === o || 'innerHTML' === o || o in n && t[o] === ('value' === o || 'checked' === o ? e[o] : n[o]) || d(e, o, n[o], n[o] = t[o], P)
//       }
//
//       function O (e) {
//         var t = e.constructor.name;
//         (B[t] || (B[t] = [])).push(e)
//       }
//
//       function C (e, t, n) {
//         var o, r = B[e.name]
//         if (e.prototype && e.prototype.render ? (o = new e(t, n), k.call(o, t, n)) : (o = new k(t, n), o.constructor = e, o.render = x), r) for (var l = r.length; l--;) if (r[l].constructor === e) {
//           o.__b = r[l].__b, r.splice(l, 1)
//           break
//         }
//         return o
//       }
//
//       function x (e, t, n) {return this.constructor(e, n)}
//
//       function E (e, t, n, o, r) {e.__x || (e.__x = !0, (e.__r = t.ref) && delete t.ref, (e.__k = t.key) && delete t.key, !e.base || r ? e.componentWillMount && e.componentWillMount() : e.componentWillReceiveProps && e.componentWillReceiveProps(t, o), o && o !== e.context && (e.__c || (e.__c = e.context), e.context = o), e.__p || (e.__p = e.props), e.props = t, e.__x = !1, 0 !== n && (1 !== n && !1 === A.syncComponentUpdates && e.base ? l(e) : N(e, 1, r)), e.__r && e.__r(e))}
//
//       function N (e, t, n, r) {
//         if (!e.__x) {
//           var l, i, u, s = e.props, p = e.state, c = e.context, d = e.__p || s, f = e.__s || p, h = e.__c || c,
//             v = e.base, y = e.__b, b = v || y, w = e._component, O = !1
//           if (v && (e.props = d, e.state = f, e.context = h, 2 !== t && e.shouldComponentUpdate && !1 === e.shouldComponentUpdate(s, p, c) ? O = !0 : e.componentWillUpdate && e.componentWillUpdate(s, p, c), e.props = s, e.state = p, e.context = c), e.__p = e.__s = e.__c = e.__b = null, e.__d = !1, !O) {
//             l = e.render(s, p, c), e.getChildContext && (c = o(o({}, c), e.getChildContext()))
//             var x, S, k = l && l.nodeName
//             if ('function' == typeof k) {
//               var M = a(l)
//               i = w, i && i.constructor === k && M.key == i.__k ? E(i, M, 1, c, !1) : (x = i, e._component = i = C(k, M, c), i.__b = i.__b || y, i.__u = e, E(i, M, 0, c, !1), N(i, 1, n, !0)), S = i.base
//             } else u = b, x = w, x && (u = e._component = null), (b || 1 === t) && (u && (u._component = null), S = _(u, l, c, n || !v, b && b.parentNode, !0))
//             if (b && S !== b && i !== w) {
//               var D = b.parentNode
//               D && S !== D && (D.replaceChild(S, b), x || (b._component = null, g(b, !1)))
//             }
//             if (x && I(x), e.base = S, S && !r) {
//               for (var L = e, T = e; T = T.__u;) (L = T).base = S
//               S._component = L, S._componentConstructor = L.constructor
//             }
//           }
//           if (!v || n ? R.unshift(e) : O || (m(), e.componentDidUpdate && e.componentDidUpdate(d, f, h), A.afterUpdate && A.afterUpdate(e)), null != e.__h) for (; e.__h.length;) e.__h.pop().call(e)
//           q || r || m()
//         }
//       }
//
//       function S (e, t, n, o) {
//         for (var r = e && e._component, l = r, i = e, u = r && e._componentConstructor === t.nodeName, s = u, p = a(t); r && !s && (r = r.__u);) s = r.constructor === t.nodeName
//         return r && s && (!o || r._component) ? (E(r, p, 3, n, o), e = r.base) : (l && !u && (I(l), e = i = null), r = C(t.nodeName, p, n), e && !r.__b && (r.__b = e, i = null), E(r, p, 1, n, o), e = r.base, i && e !== i && (i._component = null, g(i, !1))), e
//       }
//
//       function I (e) {
//         A.beforeUnmount && A.beforeUnmount(e)
//         var t = e.base
//         e.__x = !0, e.componentWillUnmount && e.componentWillUnmount(), e.base = null
//         var n = e._component
//         n ? I(n) : t && (t.__preactattr_ && t.__preactattr_.ref && t.__preactattr_.ref(null), e.__b = t, c(t), O(e), b(t)), e.__r && e.__r(null)
//       }
//
//       function k (e, t) {this.__d = !0, this.context = t, this.props = e, this.state = this.state || {}}
//
//       function M (e, t, n) {return _(n, e, {}, !1, t, !1)}
//
//       var A = {}, D = [], L = [], T = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i, V = [], R = [], q = 0,
//         P = !1, U = !1, B = {}
//       o(k.prototype, {
//         setState: function (e, t) {
//           var n = this.state
//           this.__s || (this.__s = o({}, n)), o(n, 'function' == typeof e ? e(n, this.props) : e), t && (this.__h = this.__h || []).push(t), l(this)
//         }, forceUpdate: function (e) {e && (this.__h = this.__h || []).push(e), N(this, 2)}, render: function () {}
//       })
//       var j = {h: n, createElement: n, cloneElement: r, Component: k, render: M, rerender: i, options: A}
//       e.exports = j
//     }()
//   }, function (e, t, n) {e.exports = n(2)}, function (e, t, n) {
//     'use strict'
//
//     function o (e) {
//       if (!e.element) throw new Error('element is not defined')
//       if (!e.id) throw new Error('id is not defined')
//       if (!e.source) throw new Error('source is not defined')
//       Array.isArray(e.source) && (e.source = s(e.source)), (0, l.render)((0, l.createElement)(u.default, e), e.element)
//     }
//
//     var r = Object.assign || function (e) {
//         for (var t = 1; t < arguments.length; t++) {
//           var n = arguments[t]
//           for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
//         }
//         return e
//       }, l = n(0), i = n(3), u = function (e) {return e && e.__esModule ? e : {default: e}}(i),
//       s = function (e) {return function (t, n) {n(e.filter(function (e) {return -1 !== e.toLowerCase().indexOf(t.toLowerCase())}))}}
//     o.enhanceSelectElement = function (e) {
//       if (!e.selectElement) throw new Error('selectElement is not defined')
//       if (!e.source) {
//         var t = [].filter.call(e.selectElement.options, function (t) {return t.value || e.preserveNullOptions})
//         e.source = t.map(function (e) {return e.textContent || e.innerText})
//       }
//       if (e.onConfirm = e.onConfirm || function (t) {
//         var n = [].filter.call(e.selectElement.options, function (e) {return (e.textContent || e.innerText) === t})[0]
//         n && (n.selected = !0)
//       }, e.selectElement.value || void 0 === e.defaultValue) {
//         var n = e.selectElement.options[e.selectElement.options.selectedIndex]
//         e.defaultValue = n.textContent || n.innerText
//       }
//       void 0 === e.name && (e.name = ''), void 0 === e.id && (void 0 === e.selectElement.id ? e.id = '' : e.id = e.selectElement.id), void 0 === e.autoselect && (e.autoselect = !0)
//       var l = document.createElement('span')
//       e.selectElement.parentNode.insertBefore(l, e.selectElement), o(r({}, e, {element: l})), e.selectElement.style.display = 'none', e.selectElement.id = e.selectElement.id + '-select'
//     }, e.exports = o
//   }, function (e, t, n) {
//     'use strict'
//
//     function o (e) {return e && e.__esModule ? e : {default: e}}
//
//     function r (e, t) {}
//
//     function l (e, t) {if (e) return !t || 'object' != typeof t && 'function' != typeof t ? e : t}
//
//     function i (e, t) {
//       'function' != typeof t && null !== t || (e.prototype = Object.create(t && t.prototype, {
//         constructor: {
//           value: e,
//           enumerable: !1,
//           writable: !0,
//           configurable: !0
//         }
//       }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t))
//     }
//
//     function u () {return !(!navigator.userAgent.match(/(iPod|iPhone|iPad)/g) || !navigator.userAgent.match(/AppleWebKit/g))}
//
//     function s (e) {return e > 47 && e < 58 || 32 === e || 8 === e || e > 64 && e < 91 || e > 95 && e < 112 || e > 185 && e < 193 || e > 218 && e < 223}
//
//     function a (e) {return y ? {onInput: e} : g ? {onChange: e} : void 0}
//
//     t.__esModule = !0, t.default = void 0
//     var p, c, d = Object.assign || function (e) {
//         for (var t = 1; t < arguments.length; t++) {
//           var n = arguments[t]
//           for (var o in n) Object.prototype.hasOwnProperty.call(n, o) && (e[o] = n[o])
//         }
//         return e
//       }, f = n(0), h = n(4), m = o(h), _ = n(5), v = o(_), y = !0, g = !1,
//       b = {13: 'enter', 27: 'escape', 32: 'space', 38: 'up', 40: 'down'}, w = function () {
//         var e = document.createElement('x')
//         return e.style.cssText = 'pointer-events:auto', 'auto' === e.style.pointerEvents
//       }(), O = (c = p = function (e) {
//         function t (n) {
//           r(this, t)
//           var o = l(this, e.call(this, n))
//           return o.elementReferences = {}, o.state = {
//             focused: null,
//             hovered: null,
//             menuOpen: !1,
//             options: n.defaultValue ? [n.defaultValue] : [],
//             query: n.defaultValue,
//             selected: null
//           }, o.handleComponentBlur = o.handleComponentBlur.bind(o), o.handleKeyDown = o.handleKeyDown.bind(o), o.handleUpArrow = o.handleUpArrow.bind(o), o.handleDownArrow = o.handleDownArrow.bind(o), o.handleEnter = o.handleEnter.bind(o), o.handlePrintableKey = o.handlePrintableKey.bind(o), o.handleOptionBlur = o.handleOptionBlur.bind(o), o.handleOptionClick = o.handleOptionClick.bind(o), o.handleOptionFocus = o.handleOptionFocus.bind(o), o.handleOptionMouseDown = o.handleOptionMouseDown.bind(o), o.handleOptionMouseEnter = o.handleOptionMouseEnter.bind(o), o.handleOptionMouseOut = o.handleOptionMouseOut.bind(o), o.handleInputBlur = o.handleInputBlur.bind(o), o.handleInputChange = o.handleInputChange.bind(o), o.handleInputFocus = o.handleInputFocus.bind(o), o.pollInputElement = o.pollInputElement.bind(o), o.getDirectInputChanges = o.getDirectInputChanges.bind(o), o
//         }
//
//         return i(t, e), t.prototype.componentDidMount = function () {this.pollInputElement()}, t.prototype.componentWillUnmount = function () {clearTimeout(this.$pollInput)}, t.prototype.pollInputElement = function () {
//           var e = this
//           this.getDirectInputChanges(), this.$pollInput = setTimeout(function () {e.pollInputElement()}, 100)
//         }, t.prototype.getDirectInputChanges = function () {
//           var e = this.elementReferences[-1]
//           e && e.value !== this.state.query && this.handleInputChange({target: {value: e.value}})
//         }, t.prototype.componentDidUpdate = function (e, t) {
//           var n = this.state.focused, o = null === n, r = t.focused !== n
//           r && !o && this.elementReferences[n].focus()
//           var l = -1 === n, i = r && null === t.focused
//           if (l && i) {
//             var u = this.elementReferences[n]
//             u.setSelectionRange(0, u.value.length)
//           }
//         }, t.prototype.hasAutoselect = function () {return !u() && this.props.autoselect}, t.prototype.templateInputValue = function (e) {
//           var t = this.props.templates && this.props.templates.inputValue
//           return t ? t(e) : e
//         }, t.prototype.templateSuggestion = function (e) {
//           var t = this.props.templates && this.props.templates.suggestion
//           return t ? t(e) : e
//         }, t.prototype.handleComponentBlur = function (e) {
//           var t = this.state, n = t.options, o = t.query, r = t.selected, l = void 0
//           this.props.confirmOnBlur ? (l = e.query || o, this.props.onConfirm(n[r])) : l = o, this.setState({
//             focused: null,
//             menuOpen: e.menuOpen || !1,
//             query: l,
//             selected: null
//           })
//         }, t.prototype.handleOptionBlur = function (e, t) {
//           var n = this.state, o = n.focused, r = n.menuOpen, l = n.options, i = n.selected, s = null === e.relatedTarget,
//             a = e.relatedTarget === this.elementReferences[-1], p = o !== t && -1 !== o
//           if (!p && s || !p && !a) {
//             var c = r && u()
//             this.handleComponentBlur({menuOpen: c, query: this.templateInputValue(l[i])})
//           }
//         }, t.prototype.handleInputBlur = function (e) {
//           var t = this.state, n = t.focused, o = t.menuOpen, r = t.options, l = t.query, i = t.selected
//           if (-1 === n) {
//             var s = o && u(), a = u() ? l : this.templateInputValue(r[i])
//             this.handleComponentBlur({menuOpen: s, query: a})
//           }
//         }, t.prototype.handleInputChange = function (e) {
//           var t = this, n = this.props, o = n.minLength, r = n.source, l = n.showAllValues, i = this.hasAutoselect(),
//             u = e.target.value, s = 0 === u.length, a = this.state.query.length !== u.length, p = u.length >= o
//           this.setState({query: u}), l || !s && a && p ? r(u, function (e) {
//             var n = e.length > 0
//             t.setState({menuOpen: n, options: e, selected: i && n ? 0 : -1})
//           }) : !s && p || this.setState({menuOpen: !1, options: []})
//         }, t.prototype.handleInputClick = function (e) {this.handleInputChange(e)}, t.prototype.handleInputFocus = function (e) {this.setState({focused: -1})}, t.prototype.handleOptionFocus = function (e) {
//           this.setState({
//             focused: e,
//             hovered: null,
//             selected: e
//           })
//         }, t.prototype.handleOptionMouseEnter = function (e, t) {this.setState({hovered: t})}, t.prototype.handleOptionMouseOut = function (e, t) {this.setState({hovered: null})}, t.prototype.handleOptionClick = function (e, t) {
//           var n = this.state.options[t], o = this.templateInputValue(n)
//           this.props.onConfirm(n), this.setState({focused: -1, menuOpen: !1, query: o, selected: -1}), this.forceUpdate()
//         }, t.prototype.handleOptionMouseDown = function (e) {e.preventDefault()}, t.prototype.handleUpArrow = function (e) {
//           e.preventDefault()
//           var t = this.state, n = t.menuOpen, o = t.selected;
//           -1 !== o && n && this.handleOptionFocus(o - 1)
//         }, t.prototype.handleDownArrow = function (e) {
//           var t = this
//           if (e.preventDefault(), this.props.showAllValues && !1 === this.state.menuOpen) e.preventDefault(), this.props.source('', function (e) {
//             t.setState({
//               menuOpen: !0,
//               options: e,
//               selected: 0,
//               focused: 0,
//               hovered: null
//             })
//           }) else if (!0 === this.state.menuOpen) {
//             var n = this.state, o = n.menuOpen, r = n.options, l = n.selected, i = l !== r.length - 1, u = i && o
//             u && this.handleOptionFocus(l + 1)
//           }
//         }, t.prototype.handleSpace = function (e) {
//           var t = this
//           this.props.showAllValues && !1 === this.state.menuOpen && (e.preventDefault(), this.props.source('', function (e) {
//             t.setState({
//               menuOpen: !0,
//               options: e
//             })
//           })), -1 !== this.state.focused && (e.preventDefault(), this.handleOptionClick(e, this.state.focused))
//         }, t.prototype.handleEnter = function (e) {this.state.menuOpen && (e.preventDefault(), this.state.selected >= 0 && this.handleOptionClick(e, this.state.selected))}, t.prototype.handlePrintableKey = function (e) {
//           var t = this.elementReferences[-1]
//           e.target === t || t.focus()
//         }, t.prototype.handleKeyDown = function (e) {
//           switch (b[e.keyCode]) {
//             case'up':
//               this.handleUpArrow(e)
//               break
//             case'down':
//               this.handleDownArrow(e)
//               break
//             case'space':
//               this.handleSpace(e)
//               break
//             case'enter':
//               this.handleEnter(e)
//               break
//             case'escape':
//               this.handleComponentBlur({query: this.state.query})
//               break
//             default:
//               s(e.keyCode) && this.handlePrintableKey(e)
//           }
//         }, t.prototype.render = function () {
//           var e = this, t = this.props, n = t.cssNamespace, o = t.displayMenu, r = t.id, l = t.minLength, i = t.name,
//             u = t.placeholder, s = t.required, p = t.showAllValues, c = t.tNoResults, h = t.tStatusQueryTooShort,
//             _ = t.tStatusNoResults, v = t.tStatusSelectedOption, y = t.tStatusResults, g = t.dropdownArrow,
//             b = this.state, O = b.focused, C = b.hovered, x = b.menuOpen, E = b.options, N = b.query, S = b.selected,
//             I = this.hasAutoselect(), k = -1 === O, M = 0 === E.length, A = 0 !== N.length, D = N.length >= l,
//             L = this.props.showNoOptionsFound && k && M && A && D, T = n + '__wrapper', V = n + '__input', R = null !== O,
//             q = R ? ' ' + V + '--focused' : '',
//             P = this.props.showAllValues ? ' ' + V + '--show-all-values' : ' ' + V + '--default',
//             U = n + '__dropdown-arrow-down', B = -1 !== O && null !== O, j = n + '__menu', F = j + '--' + o, W = x || L,
//             K = j + '--' + (W ? 'visible' : 'hidden'), H = n + '__option', Q = n + '__hint',
//             $ = this.templateInputValue(E[S]), z = $ && 0 === $.toLowerCase().indexOf(N.toLowerCase()),
//             G = z && I ? N + $.substr(N.length) : '', J = w && G, X = void 0
//           return p && 'string' == typeof(X = g({className: U})) && (X = (0, f.createElement)('div', {
//             className: n + '__dropdown-arrow-down-wrapper',
//             dangerouslySetInnerHTML: {__html: X}
//           })), (0, f.createElement)('div', {
//             className: T,
//             onKeyDown: this.handleKeyDown,
//             role: 'combobox',
//             'aria-expanded': x ? 'true' : 'false'
//           }, (0, f.createElement)(m.default, {
//             length: E.length,
//             queryLength: N.length,
//             minQueryLength: l,
//             selectedOption: this.templateInputValue(E[S]),
//             tQueryTooShort: h,
//             tNoResults: _,
//             tSelectedOption: v,
//             tResults: y
//           }), J && (0, f.createElement)('span', null, (0, f.createElement)('input', {
//             className: Q,
//             readonly: !0,
//             tabIndex: '-1',
//             value: G
//           })), (0, f.createElement)('input', d({
//             'aria-activedescendant': !!B && r + '__option--' + O,
//             'aria-owns': r + '__listbox',
//             autoComplete: 'off',
//             className: '' + V + q + P,
//             id: r,
//             onClick: function (t) {return e.handleInputClick(t)},
//             onBlur: this.handleInputBlur
//           }, a(this.handleInputChange), {
//             onFocus: this.handleInputFocus,
//             name: i,
//             placeholder: u,
//             ref: function (t) {e.elementReferences[-1] = t},
//             type: 'text',
//             role: 'textbox',
//             required: s,
//             value: N
//           })), X, (0, f.createElement)('ul', {
//             className: j + ' ' + F + ' ' + K,
//             id: r + '__listbox',
//             role: 'listbox'
//           }, E.map(function (t, n) {
//             var o = -1 === O ? S === n : O === n, l = o && null === C ? ' ' + H + '--focused' : '',
//               i = n % 2 ? ' ' + H + '--odd' : ''
//             return (0, f.createElement)('li', {
//               'aria-selected': O === n,
//               className: '' + H + l + i,
//               dangerouslySetInnerHTML: {__html: e.templateSuggestion(t)},
//               id: r + '__option--' + n,
//               key: n,
//               onFocusOut: function (t) {return e.handleOptionBlur(t, n)},
//               onClick: function (t) {return e.handleOptionClick(t, n)},
//               onMouseDown: e.handleOptionMouseDown,
//               onMouseEnter: function (t) {return e.handleOptionMouseEnter(t, n)},
//               onMouseOut: function (t) {return e.handleOptionMouseOut(t, n)},
//               ref: function (t) {e.elementReferences[n] = t},
//               role: 'option',
//               tabIndex: '-1'
//             })
//           }), L && (0, f.createElement)('li', {className: H + ' ' + H + '--no-results'}, c())))
//         }, t
//       }(f.Component), p.defaultProps = {
//         autoselect: !1,
//         cssNamespace: 'autocomplete',
//         defaultValue: '',
//         displayMenu: 'inline',
//         minLength: 0,
//         name: 'input-autocomplete',
//         placeholder: '',
//         onConfirm: function () {},
//         confirmOnBlur: !0,
//         showNoOptionsFound: !0,
//         showAllValues: !1,
//         required: !1,
//         tNoResults: function () {return 'No results found'},
//         dropdownArrow: v.default
//       }, c)
//     t.default = O
//   }, function (e, t, n) {
//     'use strict'
//
//     function o (e, t) {}
//
//     function r (e, t) {if (e) return !t || 'object' != typeof t && 'function' != typeof t ? e : t}
//
//     function l (e, t) {
//       'function' != typeof t && null !== t || (e.prototype = Object.create(t && t.prototype, {
//         constructor: {
//           value: e,
//           enumerable: !1,
//           writable: !0,
//           configurable: !0
//         }
//       }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t))
//     }
//
//     t.__esModule = !0, t.default = void 0
//     var i, u, s = n(0), a = (u = i = function (e) {
//       function t () {
//         var n, l, i
//         o(this, t)
//         for (var u = arguments.length, s = Array(u), a = 0; a < u; a++) s[a] = arguments[a]
//         return n = l = r(this, e.call.apply(e, [this].concat(s))), l.state = {bump: !1}, i = n, r(l, i)
//       }
//
//       return l(t, e), t.prototype.componentWillReceiveProps = function (e) {e.queryLength !== this.props.queryLength && this.setState(function (e) {return {bump: !e.bump}})}, t.prototype.render = function () {
//         var e = this.props, t = e.length, n = e.queryLength, o = e.minQueryLength, r = e.selectedOption,
//           l = e.tQueryTooShort, i = e.tNoResults, u = e.tSelectedOption, a = e.tResults, p = this.state.bump, c = n < o,
//           d = 0 === t, f = r ? u(r, t) : '', h = null
//         return h = c ? l(o) : d ? i() : a(t, f), (0, s.createElement)('div', {
//           'aria-atomic': 'true',
//           'aria-live': 'polite',
//           role: 'status',
//           style: {
//             border: '0',
//             clip: 'rect(0 0 0 0)',
//             height: '1px',
//             marginBottom: '-1px',
//             marginRight: '-1px',
//             overflow: 'hidden',
//             padding: '0',
//             position: 'absolute',
//             whiteSpace: 'nowrap',
//             width: '1px'
//           }
//         }, h, (0, s.createElement)('span', null, p ? ',' : ',,'))
//       }, t
//     }(s.Component), i.defaultProps = {
//       tQueryTooShort: function (e) {return 'Type in ' + e + ' or more characters for results.'},
//       tNoResults: function () {return 'No search results.'},
//       tSelectedOption: function (e, t) {return e + ' (1 of ' + t + ') is selected.'},
//       tResults: function (e, t) {
//         var n = {result: 1 === e ? 'result' : 'results', is: 1 === e ? 'is' : 'are'}
//         return e + ' ' + n.result + ' ' + n.is + ' available. ' + t
//       }
//     }, u)
//     t.default = a
//   }, function (e, t, n) {
//     'use strict'
//     t.__esModule = !0
//     var o = n(0), r = function (e) {
//       var t = e.className
//       return (0, o.createElement)('svg', {
//         version: '1.1',
//         xmlns: 'http://www.w3.org/2000/svg',
//         className: t,
//         focusable: 'false'
//       }, (0, o.createElement)('g', {
//         stroke: 'none',
//         fill: 'none',
//         'fill-rule': 'evenodd'
//       }, (0, o.createElement)('polygon', {fill: '#000000', points: '0 0 22 0 11 17'})))
//     }
//     t.default = r
//   }])
// })
//# sourceMappingURL=accessible-autocomplete.min.js.map