
(function($, undefined) {
    function isArray(a) {
        return a && ($.browser.safari && typeof a == "object" && a.length || a.constructor && a.constructor.toString().match(/\Array\(\)/))
    }

    function extendRemove(a, b) {
        $.extend(a, b);
        for (var c in b)
            if (b[c] == null || b[c] == undefined) a[c] = b[c];
        return a
    }

    function bindHover(a) {
        var b = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return a.bind("mouseout", function(a) {
            var c = $(a.target).closest(b);
            !c.length || c.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")
        }).bind("mouseover",
            function(c) {
                var d = $(c.target).closest(b);
                !$.datepicker._isDisabledDatepicker(instActive.inline ? a.parent()[0] : instActive.input[0]) && !!d.length && (d.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), d.addClass("ui-state-hover"), d.hasClass("ui-datepicker-prev") && d.addClass("ui-datepicker-prev-hover"), d.hasClass("ui-datepicker-next") && d.addClass("ui-datepicker-next-hover"))
            })
    }

    function Datepicker() {
        this.debug = !1, this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {
            closeText: "Done",
            prevText: "Prev",
            nextText: "Next",
            currentText: "Today",
            monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            weekHeader: "Wk",
            dateFormat: "mm/dd/yy",
            firstDay: 0,
            isRTL: !1,
            showMonthAfterYear: !1,
            yearSuffix: ""
        }, this._defaults = {
            showOn: "focus",
            showAnim: "fadeIn",
            showOptions: {},
            defaultDate: null,
            appendText: "",
            buttonText: "...",
            buttonImage: "",
            buttonImageOnly: !1,
            hideIfNoPrevNext: !1,
            navigationAsDateFormat: !1,
            gotoCurrent: !1,
            changeMonth: !1,
            changeYear: !1,
            yearRange: "c-10:c+10",
            showOtherMonths: !1,
            selectOtherMonths: !1,
            showWeek: !1,
            calculateWeek: this.iso8601Week,
            shortYearCutoff: "+10",
            minDate: null,
            maxDate: null,
            duration: "fast",
            beforeShowDay: null,
            beforeShow: null,
            onSelect: null,
            onChangeMonthYear: null,
            onClose: null,
            numberOfMonths: 1,
            showCurrentAtPos: 0,
            stepMonths: 1,
            stepBigMonths: 12,
            altField: "",
            altFormat: "",
            constrainInput: !0,
            showButtonPanel: !1,
            autoSize: !1,
            disabled: !1
        }, $.extend(this._defaults, this.regional[""]), this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
    }
    $.extend($.ui, {
        datepicker: {
            version: "1.8.17"
        }
    });
    var PROP_NAME = "datepicker",
        dpuuid = (new Date).getTime(),
        instActive;
    $.extend(Datepicker.prototype, {
        markerClassName: "hasDatepicker",
        maxRows: 4,
        log: function() {
            this.debug && console.log.apply("", arguments)
        },
        _widgetDatepicker: function() {
            return this.dpDiv
        },
        setDefaults: function(a) {
            extendRemove(this._defaults, a || {});
            return this
        },
        _attachDatepicker: function(target, settings) {
            var inlineSettings = null;
            for (var attrName in this._defaults) {
                var attrValue = target.getAttribute("date:" + attrName);
                if (attrValue) {
                    inlineSettings = inlineSettings || {};
                    try {
                        inlineSettings[attrName] = eval(attrValue)
                    } catch (err) {
                        inlineSettings[attrName] = attrValue
                    }
                }
            }
            var nodeName = target.nodeName.toLowerCase(),
                inline = nodeName == "div" || nodeName == "span";
            target.id || (this.uuid += 1, target.id = "dp" + this.uuid);
            var inst = this._newInst($(target), inline);
            inst.settings = $.extend({}, settings || {}, inlineSettings || {}), nodeName == "input" ? this._connectDatepicker(target, inst) : inline && this._inlineDatepicker(target, inst)
        },
        _newInst: function(a, b) {
            var c = a[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1");
            return {
                id: c,
                input: a,
                selectedDay: 0,
                selectedMonth: 0,
                selectedYear: 0,
                drawMonth: 0,
                drawYear: 0,
                inline: b,
                dpDiv: b ? bindHover($('<div class="' + this._inlineClass +
                    ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')) : this.dpDiv
            }
        },
        _connectDatepicker: function(a, b) {
            var c = $(a);
            b.append = $([]), b.trigger = $([]);
            c.hasClass(this.markerClassName) || (this._attachments(c, b), c.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker", function(a, c, d) {
                b.settings[c] = d
            }).bind("getData.datepicker", function(a, c) {
                return this._get(b, c)
            }), this._autoSize(b), $.data(a, PROP_NAME,
                b), b.settings.disabled && this._disableDatepicker(a))
        },
        _attachments: function(a, b) {
            var c = this._get(b, "appendText"),
                d = this._get(b, "isRTL");
            b.append && b.append.remove(), c && (b.append = $('<span class="' + this._appendClass + '">' + c + "</span>"), a[d ? "before" : "after"](b.append)), a.unbind("focus", this._showDatepicker), b.trigger && b.trigger.remove();
            var e = this._get(b, "showOn");
            (e == "focus" || e == "both") && a.focus(this._showDatepicker);
            if (e == "button" || e == "both") {
                var f = this._get(b, "buttonText"),
                    g = this._get(b, "buttonImage");
                b.trigger = $(this._get(b, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({
                    src: g,
                    alt: f,
                    title: f
                }) : $('<button type="button"></button>').addClass(this._triggerClass).html(g == "" ? f : $("<img/>").attr({
                    src: g,
                    alt: f,
                    title: f
                }))), a[d ? "before" : "after"](b.trigger), b.trigger.click(function() {
                    $.datepicker._datepickerShowing && $.datepicker._lastInput == a[0] ? $.datepicker._hideDatepicker() : $.datepicker._showDatepicker(a[0]);
                    return !1
                })
            }
        },
        _autoSize: function(a) {
            if (this._get(a, "autoSize") && !a.inline) {
                var b =
                    new Date(2009, 11, 20),
                    c = this._get(a, "dateFormat");
                if (c.match(/[DM]/)) {
                    var d = function(a) {
                        var b = 0,
                            c = 0;
                        for (var d = 0; d < a.length; d++) a[d].length > b && (b = a[d].length, c = d);
                        return c
                    };
                    b.setMonth(d(this._get(a, c.match(/MM/) ? "monthNames" : "monthNamesShort"))), b.setDate(d(this._get(a, c.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - b.getDay())
                }
                a.input.attr("size", this._formatDate(a, b).length)
            }
        },
        _inlineDatepicker: function(a, b) {
            var c = $(a);
            c.hasClass(this.markerClassName) || (c.addClass(this.markerClassName).append(b.dpDiv).bind("setData.datepicker",
                function(a, c, d) {
                    b.settings[c] = d
                }).bind("getData.datepicker", function(a, c) {
                return this._get(b, c)
            }), $.data(a, PROP_NAME, b), this._setDate(b, this._getDefaultDate(b), !0), this._updateDatepicker(b), this._updateAlternate(b), b.settings.disabled && this._disableDatepicker(a), b.dpDiv.css("display", "block"))
        },
        _dialogDatepicker: function(a, b, c, d, e) {
            var f = this._dialogInst;
            if (!f) {
                this.uuid += 1;
                var g = "dp" + this.uuid;
                this._dialogInput = $('<input type="text" id="' + g + '" style="position: absolute; top: -100px; width: 0px; z-index: -10;"/>'),
                    this._dialogInput.keydown(this._doKeyDown), $("body").append(this._dialogInput), f = this._dialogInst = this._newInst(this._dialogInput, !1), f.settings = {}, $.data(this._dialogInput[0], PROP_NAME, f)
            }
            extendRemove(f.settings, d || {}), b = b && b.constructor == Date ? this._formatDate(f, b) : b, this._dialogInput.val(b), this._pos = e ? e.length ? e : [e.pageX, e.pageY] : null;
            if (!this._pos) {
                var h = document.documentElement.clientWidth,
                    i = document.documentElement.clientHeight,
                    j = document.documentElement.scrollLeft || document.body.scrollLeft,
                    k = document.documentElement.scrollTop || document.body.scrollTop;
                this._pos = [h / 2 - 100 + j, i / 2 - 150 + k]
            }
            this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), f.settings.onSelect = c, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), $.blockUI && $.blockUI(this.dpDiv), $.data(this._dialogInput[0], PROP_NAME, f);
            return this
        },
        _destroyDatepicker: function(a) {
            var b = $(a),
                c = $.data(a, PROP_NAME);
            if (!!b.hasClass(this.markerClassName)) {
                var d = a.nodeName.toLowerCase();
                $.removeData(a, PROP_NAME), d == "input" ? (c.append.remove(), c.trigger.remove(), b.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : (d == "div" || d == "span") && b.removeClass(this.markerClassName).empty()
            }
        },
        _enableDatepicker: function(a) {
            var b = $(a),
                c = $.data(a, PROP_NAME);
            if (!!b.hasClass(this.markerClassName)) {
                var d = a.nodeName.toLowerCase();
                if (d == "input") a.disabled = !1, c.trigger.filter("button").each(function() {
                    this.disabled = !1
                }).end().filter("img").css({
                    opacity: "1.0",
                    cursor: ""
                });
                else if (d == "div" || d == "span") {
                    var e = b.children("." + this._inlineClass);
                    e.children().removeClass("ui-state-disabled"), e.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")
                }
                this._disabledInputs = $.map(this._disabledInputs, function(b) {
                    return b == a ? null : b
                })
            }
        },
        _disableDatepicker: function(a) {
            var b = $(a),
                c = $.data(a, PROP_NAME);
            if (!!b.hasClass(this.markerClassName)) {
                var d = a.nodeName.toLowerCase();
                if (d == "input") a.disabled = !0,
                    c.trigger.filter("button").each(function() {
                        this.disabled = !0
                    }).end().filter("img").css({
                        opacity: "0.5",
                        cursor: "default"
                    });
                else if (d == "div" || d == "span") {
                    var e = b.children("." + this._inlineClass);
                    e.children().addClass("ui-state-disabled"), e.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled")
                }
                this._disabledInputs = $.map(this._disabledInputs, function(b) {
                    return b == a ? null : b
                }), this._disabledInputs[this._disabledInputs.length] = a
            }
        },
        _isDisabledDatepicker: function(a) {
            if (!a) return !1;
            for (var b = 0; b < this._disabledInputs.length; b++)
                if (this._disabledInputs[b] == a) return !0;
            return !1
        },
        _getInst: function(a) {
            try {
                return $.data(a, PROP_NAME)
            } catch (b) {
                throw "Missing instance data for this datepicker";
            }
        },
        _optionDatepicker: function(a, b, c) {
            var d = this._getInst(a);
            if (arguments.length == 2 && typeof b == "string") return b == "defaults" ? $.extend({}, $.datepicker._defaults) : d ? b == "all" ? $.extend({}, d.settings) : this._get(d, b) : null;
            var e = b || {};
            typeof b == "string" && (e = {}, e[b] = c);
            if (d) {
                this._curInst == d && this._hideDatepicker();
                var f = this._getDateDatepicker(a, !0),
                    g = this._getMinMaxDate(d, "min"),
                    h = this._getMinMaxDate(d, "max");
                extendRemove(d.settings, e), g !== null && e.dateFormat !== undefined && e.minDate === undefined && (d.settings.minDate = this._formatDate(d, g)), h !== null && e.dateFormat !== undefined && e.maxDate === undefined && (d.settings.maxDate = this._formatDate(d, h)), this._attachments($(a), d), this._autoSize(d), this._setDate(d, f), this._updateAlternate(d), this._updateDatepicker(d)
            }
        },
        _changeDatepicker: function(a, b, c) {
            this._optionDatepicker(a,
                b, c)
        },
        _refreshDatepicker: function(a) {
            var b = this._getInst(a);
            b && this._updateDatepicker(b)
        },
        _setDateDatepicker: function(a, b) {
            var c = this._getInst(a);
            c && (this._setDate(c, b), this._updateDatepicker(c), this._updateAlternate(c))
        },
        _getDateDatepicker: function(a, b) {
            var c = this._getInst(a);
            c && !c.inline && this._setDateFromField(c, b);
            return c ? this._getDate(c) : null
        },
        _doKeyDown: function(a) {
            var b = $.datepicker._getInst(a.target),
                c = !0,
                d = b.dpDiv.is(".ui-datepicker-rtl");
            b._keyEvent = !0;
            if ($.datepicker._datepickerShowing) switch (a.keyCode) {
                case 9:
                    $.datepicker._hideDatepicker(),
                        c = !1;
                    break;
                case 13:
                    var e = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", b.dpDiv);
                    e[0] && $.datepicker._selectDay(a.target, b.selectedMonth, b.selectedYear, e[0]);
                    var f = $.datepicker._get(b, "onSelect");
                    if (f) {
                        var g = $.datepicker._formatDate(b);
                        f.apply(b.input ? b.input[0] : null, [g, b])
                    } else $.datepicker._hideDatepicker();
                    return !1;
                case 27:
                    $.datepicker._hideDatepicker();
                    break;
                case 33:
                    $.datepicker._adjustDate(a.target, a.ctrlKey ? -$.datepicker._get(b, "stepBigMonths") : -$.datepicker._get(b,
                        "stepMonths"), "M");
                    break;
                case 34:
                    $.datepicker._adjustDate(a.target, a.ctrlKey ? +$.datepicker._get(b, "stepBigMonths") : +$.datepicker._get(b, "stepMonths"), "M");
                    break;
                case 35:
                    (a.ctrlKey || a.metaKey) && $.datepicker._clearDate(a.target), c = a.ctrlKey || a.metaKey;
                    break;
                case 36:
                    (a.ctrlKey || a.metaKey) && $.datepicker._gotoToday(a.target), c = a.ctrlKey || a.metaKey;
                    break;
                case 37:
                    (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, d ? 1 : -1, "D"), c = a.ctrlKey || a.metaKey, a.originalEvent.altKey && $.datepicker._adjustDate(a.target,
                        a.ctrlKey ? -$.datepicker._get(b, "stepBigMonths") : -$.datepicker._get(b, "stepMonths"), "M");
                    break;
                case 38:
                    (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, -7, "D"), c = a.ctrlKey || a.metaKey;
                    break;
                case 39:
                    (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target, d ? -1 : 1, "D"), c = a.ctrlKey || a.metaKey, a.originalEvent.altKey && $.datepicker._adjustDate(a.target, a.ctrlKey ? +$.datepicker._get(b, "stepBigMonths") : +$.datepicker._get(b, "stepMonths"), "M");
                    break;
                case 40:
                    (a.ctrlKey || a.metaKey) && $.datepicker._adjustDate(a.target,
                        7, "D"), c = a.ctrlKey || a.metaKey;
                    break;
                default:
                    c = !1
            } else a.keyCode == 36 && a.ctrlKey ? $.datepicker._showDatepicker(this) : c = !1;
            c && (a.preventDefault(), a.stopPropagation())
        },
        _doKeyPress: function(a) {
            var b = $.datepicker._getInst(a.target);
            if ($.datepicker._get(b, "constrainInput")) {
                var c = $.datepicker._possibleChars($.datepicker._get(b, "dateFormat")),
                    d = String.fromCharCode(a.charCode == undefined ? a.keyCode : a.charCode);
                return a.ctrlKey || a.metaKey || d < " " || !c || c.indexOf(d) > -1
            }
        },
        _doKeyUp: function(a) {
            var b = $.datepicker._getInst(a.target);
            if (b.input.val() != b.lastVal) try {
                var c = $.datepicker.parseDate($.datepicker._get(b, "dateFormat"), b.input ? b.input.val() : null, $.datepicker._getFormatConfig(b));
                c && ($.datepicker._setDateFromField(b), $.datepicker._updateAlternate(b), $.datepicker._updateDatepicker(b))
            } catch (a) {
                $.datepicker.log(a)
            }
            return !0
        },
        _showDatepicker: function(a) {
            a = a.target || a, a.nodeName.toLowerCase() != "input" && (a = $("input", a.parentNode)[0]);
            if (!$.datepicker._isDisabledDatepicker(a) && $.datepicker._lastInput != a) {
                var b = $.datepicker._getInst(a);
                $.datepicker._curInst && $.datepicker._curInst != b && ($.datepicker._curInst.dpDiv.stop(!0, !0), b && $.datepicker._datepickerShowing && $.datepicker._hideDatepicker($.datepicker._curInst.input[0]));
                var c = $.datepicker._get(b, "beforeShow"),
                    d = c ? c.apply(a, [a, b]) : {};
                if (d === !1) return;
                extendRemove(b.settings, d), b.lastVal = null, $.datepicker._lastInput = a, $.datepicker._setDateFromField(b), $.datepicker._inDialog && (a.value = ""), $.datepicker._pos || ($.datepicker._pos = $.datepicker._findPos(a), $.datepicker._pos[1] += a.offsetHeight);
                var e = !1;
                $(a).parents().each(function() {
                    e |= $(this).css("position") == "fixed";
                    return !e
                }), e && $.browser.opera && ($.datepicker._pos[0] -= document.documentElement.scrollLeft, $.datepicker._pos[1] -= document.documentElement.scrollTop);
                var f = {
                    left: $.datepicker._pos[0],
                    top: $.datepicker._pos[1]
                };
                $.datepicker._pos = null, b.dpDiv.empty(), b.dpDiv.css({
                    position: "absolute",
                    display: "block",
                    top: "-1000px"
                }), $.datepicker._updateDatepicker(b), f = $.datepicker._checkOffset(b, f, e), b.dpDiv.css({
                    position: $.datepicker._inDialog &&
                        $.blockUI ? "static" : e ? "fixed" : "absolute",
                    display: "none",
                    left: f.left + "px",
                    top: f.top + "px"
                });
                if (!b.inline) {
                    var g = $.datepicker._get(b, "showAnim"),
                        h = $.datepicker._get(b, "duration"),
                        i = function() {
                            var a = b.dpDiv.find("iframe.ui-datepicker-cover");
                            if (!!a.length) {
                                var c = $.datepicker._getBorders(b.dpDiv);
                                a.css({
                                    left: -c[0],
                                    top: -c[1],
                                    width: b.dpDiv.outerWidth(),
                                    height: b.dpDiv.outerHeight()
                                })
                            }
                        };
                    b.dpDiv.zIndex($(a).zIndex() + 1), $.datepicker._datepickerShowing = !0, $.effects && $.effects[g] ? b.dpDiv.show(g, $.datepicker._get(b,
                        "showOptions"), h, i) : b.dpDiv[g || "show"](g ? h : null, i), (!g || !h) && i(), b.input.is(":visible") && !b.input.is(":disabled") && b.input.focus(), $.datepicker._curInst = b
                }
            }
        },
        _updateDatepicker: function(a) {
            var b = this;
            b.maxRows = 4;
            var c = $.datepicker._getBorders(a.dpDiv);
            instActive = a, a.dpDiv.empty().append(this._generateHTML(a));
            var d = a.dpDiv.find("iframe.ui-datepicker-cover");
            !d.length || d.css({
                left: -c[0],
                top: -c[1],
                width: a.dpDiv.outerWidth(),
                height: a.dpDiv.outerHeight()
            }), a.dpDiv.find("." + this._dayOverClass + " a").mouseover();
            var e = this._getNumberOfMonths(a),
                f = e[1],
                g = 17;
            a.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), f > 1 && a.dpDiv.addClass("ui-datepicker-multi-" + f).css("width", g * f + "em"), a.dpDiv[(e[0] != 1 || e[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi"), a.dpDiv[(this._get(a, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), a == $.datepicker._curInst && $.datepicker._datepickerShowing && a.input && a.input.is(":visible") && !a.input.is(":disabled") && a.input[0] != document.activeElement &&
                a.input.focus();
            if (a.yearshtml) {
                var h = a.yearshtml;
                setTimeout(function() {
                    h === a.yearshtml && a.yearshtml && a.dpDiv.find("select.ui-datepicker-year:first").replaceWith(a.yearshtml), h = a.yearshtml = null
                }, 0)
            }
        },
        _getBorders: function(a) {
            var b = function(a) {
                return {
                    thin: 1,
                    medium: 2,
                    thick: 3
                }[a] || a
            };
            return [parseFloat(b(a.css("border-left-width"))), parseFloat(b(a.css("border-top-width")))]
        },
        _checkOffset: function(a, b, c) {
            var d = a.dpDiv.outerWidth(),
                e = a.dpDiv.outerHeight(),
                f = a.input ? a.input.outerWidth() : 0,
                g = a.input ? a.input.outerHeight() :
                0,
                h = document.documentElement.clientWidth + $(document).scrollLeft(),
                i = document.documentElement.clientHeight + $(document).scrollTop();
            b.left -= this._get(a, "isRTL") ? d - f : 0, b.left -= c && b.left == a.input.offset().left ? $(document).scrollLeft() : 0, b.top -= c && b.top == a.input.offset().top + g ? $(document).scrollTop() : 0, b.left -= Math.min(b.left, b.left + d > h && h > d ? Math.abs(b.left + d - h) : 0), b.top -= Math.min(b.top, b.top + e > i && i > e ? Math.abs(e + g) : 0);
            return b
        },
        _findPos: function(a) {
            var b = this._getInst(a),
                c = this._get(b, "isRTL");
            while (a &&
                (a.type == "hidden" || a.nodeType != 1 || $.expr.filters.hidden(a))) a = a[c ? "previousSibling" : "nextSibling"];
            var d = $(a).offset();
            return [d.left, d.top]
        },
        _hideDatepicker: function(a) {
            var b = this._curInst;
            if (!(!b || a && b != $.data(a, PROP_NAME)) && this._datepickerShowing) {
                var c = this._get(b, "showAnim"),
                    d = this._get(b, "duration"),
                    e = this,
                    f = function() {
                        $.datepicker._tidyDialog(b), e._curInst = null
                    };
                $.effects && $.effects[c] ? b.dpDiv.hide(c, $.datepicker._get(b, "showOptions"), d, f) : b.dpDiv[c == "slideDown" ? "slideUp" : c == "fadeIn" ? "fadeOut" :
                    "hide"](c ? d : null, f), c || f(), this._datepickerShowing = !1;
                var g = this._get(b, "onClose");
                g && g.apply(b.input ? b.input[0] : null, [b.input ? b.input.val() : "", b]), this._lastInput = null, this._inDialog && (this._dialogInput.css({
                    position: "absolute",
                    left: "0",
                    top: "-100px"
                }), $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))), this._inDialog = !1
            }
        },
        _tidyDialog: function(a) {
            a.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
        },
        _checkExternalClick: function(a) {
            if (!!$.datepicker._curInst) {
                var b = $(a.target),
                    c = $.datepicker._getInst(b[0]);
                (b[0].id != $.datepicker._mainDivId && b.parents("#" + $.datepicker._mainDivId).length == 0 && !b.hasClass($.datepicker.markerClassName) && !b.hasClass($.datepicker._triggerClass) && $.datepicker._datepickerShowing && (!$.datepicker._inDialog || !$.blockUI) || b.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != c) && $.datepicker._hideDatepicker()
            }
        },
        _adjustDate: function(a, b, c) {
            var d = $(a),
                e = this._getInst(d[0]);
            this._isDisabledDatepicker(d[0]) || (this._adjustInstDate(e, b + (c == "M" ?
                this._get(e, "showCurrentAtPos") : 0), c), this._updateDatepicker(e))
        },
        _gotoToday: function(a) {
            var b = $(a),
                c = this._getInst(b[0]);
            if (this._get(c, "gotoCurrent") && c.currentDay) c.selectedDay = c.currentDay, c.drawMonth = c.selectedMonth = c.currentMonth, c.drawYear = c.selectedYear = c.currentYear;
            else {
                var d = new Date;
                c.selectedDay = d.getDate(), c.drawMonth = c.selectedMonth = d.getMonth(), c.drawYear = c.selectedYear = d.getFullYear()
            }
            this._notifyChange(c), this._adjustDate(b)
        },
        _selectMonthYear: function(a, b, c) {
            var d = $(a),
                e = this._getInst(d[0]);
            e["selected" + (c == "M" ? "Month" : "Year")] = e["draw" + (c == "M" ? "Month" : "Year")] = parseInt(b.options[b.selectedIndex].value, 10), this._notifyChange(e), this._adjustDate(d)
        },
        _selectDay: function(a, b, c, d) {
            var e = $(a);
            if (!$(d).hasClass(this._unselectableClass) && !this._isDisabledDatepicker(e[0])) {
                var f = this._getInst(e[0]);
                f.selectedDay = f.currentDay = $("a", d).html(), f.selectedMonth = f.currentMonth = b, f.selectedYear = f.currentYear = c, this._selectDate(a, this._formatDate(f, f.currentDay, f.currentMonth, f.currentYear))
            }
        },
        _clearDate: function(a) {
            var b =
                $(a),
                c = this._getInst(b[0]);
            this._selectDate(b, "")
        },
        _selectDate: function(a, b) {
            var c = $(a),
                d = this._getInst(c[0]);
            b = b != null ? b : this._formatDate(d), d.input && d.input.val(b), this._updateAlternate(d);
            var e = this._get(d, "onSelect");
            e ? e.apply(d.input ? d.input[0] : null, [b, d]) : d.input && d.input.trigger("change"), d.inline ? this._updateDatepicker(d) : (this._hideDatepicker(), this._lastInput = d.input[0], typeof d.input[0] != "object" && d.input.focus(), this._lastInput = null)
        },
        _updateAlternate: function(a) {
            var b = this._get(a, "altField");
            if (b) {
                var c = this._get(a, "altFormat") || this._get(a, "dateFormat"),
                    d = this._getDate(a),
                    e = this.formatDate(c, d, this._getFormatConfig(a));
                $(b).each(function() {
                    $(this).val(e)
                })
            }
        },
        noWeekends: function(a) {
            var b = a.getDay();
            return [b > 0 && b < 6, ""]
        },
        iso8601Week: function(a) {
            var b = new Date(a.getTime());
            b.setDate(b.getDate() + 4 - (b.getDay() || 7));
            var c = b.getTime();
            b.setMonth(0), b.setDate(1);
            return Math.floor(Math.round((c - b) / 864E5) / 7) + 1
        },
        parseDate: function(a, b, c) {
            if (a == null || b == null) throw "Invalid arguments";
            b = typeof b ==
                "object" ? b.toString() : b + "";
            if (b == "") return null;
            var d = (c ? c.shortYearCutoff : null) || this._defaults.shortYearCutoff;
            d = typeof d != "string" ? d : (new Date).getFullYear() % 100 + parseInt(d, 10);
            var e = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort,
                f = (c ? c.dayNames : null) || this._defaults.dayNames,
                g = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort,
                h = (c ? c.monthNames : null) || this._defaults.monthNames,
                i = -1,
                j = -1,
                k = -1,
                l = -1,
                m = !1,
                n = function(b) {
                    var c = s + 1 < a.length && a.charAt(s + 1) == b;
                    c && s++;
                    return c
                },
                o = function(a) {
                    var c =
                        n(a),
                        d = a == "@" ? 14 : a == "!" ? 20 : a == "y" && c ? 4 : a == "o" ? 3 : 2,
                        e = new RegExp("^\\d{1," + d + "}"),
                        f = b.substring(r).match(e);
                    if (!f) throw "Missing number at position " + r;
                    r += f[0].length;
                    return parseInt(f[0], 10)
                },
                p = function(a, c, d) {
                    var e = $.map(n(a) ? d : c, function(a, b) {
                            return [
                                [b, a]
                            ]
                        }).sort(function(a, b) {
                            return -(a[1].length - b[1].length)
                        }),
                        f = -1;
                    $.each(e, function(a, c) {
                        var d = c[1];
                        if (b.substr(r, d.length).toLowerCase() == d.toLowerCase()) {
                            f = c[0], r += d.length;
                            return !1
                        }
                    });
                    if (f != -1) return f + 1;
                    throw "Unknown name at position " + r;
                },
                q = function() {
                    if (b.charAt(r) !=
                        a.charAt(s)) throw "Unexpected literal at position " + r;
                    r++
                },
                r = 0;
            for (var s = 0; s < a.length; s++)
                if (m) a.charAt(s) == "'" && !n("'") ? m = !1 : q();
                else switch (a.charAt(s)) {
                    case "d":
                        k = o("d");
                        break;
                    case "D":
                        p("D", e, f);
                        break;
                    case "o":
                        l = o("o");
                        break;
                    case "m":
                        j = o("m");
                        break;
                    case "M":
                        j = p("M", g, h);
                        break;
                    case "y":
                        i = o("y");
                        break;
                    case "@":
                        var t = new Date(o("@"));
                        i = t.getFullYear(), j = t.getMonth() + 1, k = t.getDate();
                        break;
                    case "!":
                        var t = new Date((o("!") - this._ticksTo1970) / 1E4);
                        i = t.getFullYear(), j = t.getMonth() + 1, k = t.getDate();
                        break;
                    case "'":
                        n("'") ? q() : m = !0;
                        break;
                    default:
                        q()
                }
                if (r < b.length) throw "Extra/unparsed characters found in date: " + b.substring(r);
            i == -1 ? i = (new Date).getFullYear() : i < 100 && (i += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (i <= d ? 0 : -100));
            if (l > -1) {
                j = 1, k = l;
                for (;;) {
                    var u = this._getDaysInMonth(i, j - 1);
                    if (k <= u) break;
                    j++, k -= u
                }
            }
            var t = this._daylightSavingAdjust(new Date(i, j - 1, k));
            if (t.getFullYear() != i || t.getMonth() + 1 != j || t.getDate() != k) throw "Invalid date";
            return t
        },
        ATOM: "yy-mm-dd",
        COOKIE: "D, dd M yy",
        ISO_8601: "yy-mm-dd",
        RFC_822: "D, d M y",
        RFC_850: "DD, dd-M-y",
        RFC_1036: "D, d M y",
        RFC_1123: "D, d M yy",
        RFC_2822: "D, d M yy",
        RSS: "D, d M y",
        TICKS: "!",
        TIMESTAMP: "@",
        W3C: "yy-mm-dd",
        _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1E7,
        formatDate: function(a, b, c) {
            if (!b) return "";
            var d = (c ? c.dayNamesShort : null) || this._defaults.dayNamesShort,
                e = (c ? c.dayNames : null) || this._defaults.dayNames,
                f = (c ? c.monthNamesShort : null) || this._defaults.monthNamesShort,
                g = (c ? c.monthNames : null) || this._defaults.monthNames,
                h = function(b) {
                    var c = m + 1 < a.length && a.charAt(m + 1) == b;
                    c && m++;
                    return c
                },
                i = function(a, b, c) {
                    var d = "" + b;
                    if (h(a))
                        while (d.length < c) d = "0" + d;
                    return d
                },
                j = function(a, b, c, d) {
                    return h(a) ? d[b] : c[b]
                },
                k = "",
                l = !1;
            if (b)
                for (var m = 0; m < a.length; m++)
                    if (l) a.charAt(m) == "'" && !h("'") ? l = !1 : k += a.charAt(m);
                    else switch (a.charAt(m)) {
                        case "d":
                            k += i("d", b.getDate(), 2);
                            break;
                        case "D":
                            k += j("D", b.getDay(), d, e);
                            break;
                        case "o":
                            k += i("o", Math.round(((new Date(b.getFullYear(), b.getMonth(), b.getDate())).getTime() - (new Date(b.getFullYear(), 0,
                                0)).getTime()) / 864E5), 3);
                            break;
                        case "m":
                            k += i("m", b.getMonth() + 1, 2);
                            break;
                        case "M":
                            k += j("M", b.getMonth(), f, g);
                            break;
                        case "y":
                            k += h("y") ? b.getFullYear() : (b.getYear() % 100 < 10 ? "0" : "") + b.getYear() % 100;
                            break;
                        case "@":
                            k += b.getTime();
                            break;
                        case "!":
                            k += b.getTime() * 1E4 + this._ticksTo1970;
                            break;
                        case "'":
                            h("'") ? k += "'" : l = !0;
                            break;
                        default:
                            k += a.charAt(m)
                    }
                    return k
        },
        _possibleChars: function(a) {
            var b = "",
                c = !1,
                d = function(b) {
                    var c = e + 1 < a.length && a.charAt(e + 1) == b;
                    c && e++;
                    return c
                };
            for (var e = 0; e < a.length; e++)
                if (c) a.charAt(e) ==
                    "'" && !d("'") ? c = !1 : b += a.charAt(e);
                else switch (a.charAt(e)) {
                    case "d":
                    case "m":
                    case "y":
                    case "@":
                        b += "0123456789";
                        break;
                    case "D":
                    case "M":
                        return null;
                    case "'":
                        d("'") ? b += "'" : c = !0;
                        break;
                    default:
                        b += a.charAt(e)
                }
                return b
        },
        _get: function(a, b) {
            return a.settings[b] !== undefined ? a.settings[b] : this._defaults[b]
        },
        _setDateFromField: function(a, b) {
            if (a.input.val() != a.lastVal) {
                var c = this._get(a, "dateFormat"),
                    d = a.lastVal = a.input ? a.input.val() : null,
                    e, f;
                e = f = this._getDefaultDate(a);
                var g = this._getFormatConfig(a);
                try {
                    e = this.parseDate(c,
                        d, g) || f
                } catch (h) {
                    this.log(h), d = b ? "" : d
                }
                a.selectedDay = e.getDate(), a.drawMonth = a.selectedMonth = e.getMonth(), a.drawYear = a.selectedYear = e.getFullYear(), a.currentDay = d ? e.getDate() : 0, a.currentMonth = d ? e.getMonth() : 0, a.currentYear = d ? e.getFullYear() : 0, this._adjustInstDate(a)
            }
        },
        _getDefaultDate: function(a) {
            return this._restrictMinMax(a, this._determineDate(a, this._get(a, "defaultDate"), new Date))
        },
        _determineDate: function(a, b, c) {
            var d = function(a) {
                    var b = new Date;
                    b.setDate(b.getDate() + a);
                    return b
                },
                e = function(b) {
                    try {
                        return $.datepicker.parseDate($.datepicker._get(a,
                            "dateFormat"), b, $.datepicker._getFormatConfig(a))
                    } catch (c) {}
                    var d = (b.toLowerCase().match(/^c/) ? $.datepicker._getDate(a) : null) || new Date,
                        e = d.getFullYear(),
                        f = d.getMonth(),
                        g = d.getDate(),
                        h = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,
                        i = h.exec(b);
                    while (i) {
                        switch (i[2] || "d") {
                            case "d":
                            case "D":
                                g += parseInt(i[1], 10);
                                break;
                            case "w":
                            case "W":
                                g += parseInt(i[1], 10) * 7;
                                break;
                            case "m":
                            case "M":
                                f += parseInt(i[1], 10), g = Math.min(g, $.datepicker._getDaysInMonth(e, f));
                                break;
                            case "y":
                            case "Y":
                                e += parseInt(i[1], 10), g = Math.min(g, $.datepicker._getDaysInMonth(e,
                                    f))
                        }
                        i = h.exec(b)
                    }
                    return new Date(e, f, g)
                },
                f = b == null || b === "" ? c : typeof b == "string" ? e(b) : typeof b == "number" ? isNaN(b) ? c : d(b) : new Date(b.getTime());
            f = f && f.toString() == "Invalid Date" ? c : f, f && (f.setHours(0), f.setMinutes(0), f.setSeconds(0), f.setMilliseconds(0));
            return this._daylightSavingAdjust(f)
        },
        _daylightSavingAdjust: function(a) {
            if (!a) return null;
            a.setHours(a.getHours() > 12 ? a.getHours() + 2 : 0);
            return a
        },
        _setDate: function(a, b, c) {
            var d = !b,
                e = a.selectedMonth,
                f = a.selectedYear,
                g = this._restrictMinMax(a, this._determineDate(a,
                    b, new Date));
            a.selectedDay = a.currentDay = g.getDate(), a.drawMonth = a.selectedMonth = a.currentMonth = g.getMonth(), a.drawYear = a.selectedYear = a.currentYear = g.getFullYear(), (e != a.selectedMonth || f != a.selectedYear) && !c && this._notifyChange(a), this._adjustInstDate(a), a.input && a.input.val(d ? "" : this._formatDate(a))
        },
        _getDate: function(a) {
            var b = !a.currentYear || a.input && a.input.val() == "" ? null : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
            return b
        },
        _generateHTML: function(a) {
            var b = new Date;
            b = this._daylightSavingAdjust(new Date(b.getFullYear(), b.getMonth(), b.getDate()));
            var c = this._get(a, "isRTL"),
                d = this._get(a, "showButtonPanel"),
                e = this._get(a, "hideIfNoPrevNext"),
                f = this._get(a, "navigationAsDateFormat"),
                g = this._getNumberOfMonths(a),
                h = this._get(a, "showCurrentAtPos"),
                i = this._get(a, "stepMonths"),
                j = g[0] != 1 || g[1] != 1,
                k = this._daylightSavingAdjust(a.currentDay ? new Date(a.currentYear, a.currentMonth, a.currentDay) : new Date(9999, 9, 9)),
                l = this._getMinMaxDate(a, "min"),
                m = this._getMinMaxDate(a, "max"),
                n = a.drawMonth - h,
                o = a.drawYear;
            n < 0 && (n += 12, o--);
            if (m) {
                var p = this._daylightSavingAdjust(new Date(m.getFullYear(), m.getMonth() - g[0] * g[1] + 1, m.getDate()));
                p = l && p < l ? l : p;
                while (this._daylightSavingAdjust(new Date(o, n, 1)) > p) n--, n < 0 && (n = 11, o--)
            }
            a.drawMonth = n, a.drawYear = o;
            var q = this._get(a, "prevText");
            q = f ? this.formatDate(q, this._daylightSavingAdjust(new Date(o, n - i, 1)), this._getFormatConfig(a)) : q;
            var r = this._canAdjustMonth(a, -1, o, n) ? '<a class="ui-datepicker-prev ui-corner-all" onclick="DP_jQuery_' + dpuuid + ".datepicker._adjustDate('#" +
                a.id + "', -" + i + ", 'M');\"" + ' title="' + q + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + q + "</span></a>" : e ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + q + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "e" : "w") + '">' + q + "</span></a>",
                s = this._get(a, "nextText");
            s = f ? this.formatDate(s, this._daylightSavingAdjust(new Date(o, n + i, 1)), this._getFormatConfig(a)) : s;
            var t = this._canAdjustMonth(a, 1, o, n) ? '<a class="ui-datepicker-next ui-corner-all" onclick="DP_jQuery_' +
                dpuuid + ".datepicker._adjustDate('#" + a.id + "', +" + i + ", 'M');\"" + ' title="' + s + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + s + "</span></a>" : e ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + s + '"><span class="ui-icon ui-icon-circle-triangle-' + (c ? "w" : "e") + '">' + s + "</span></a>",
                u = this._get(a, "currentText"),
                v = this._get(a, "gotoCurrent") && a.currentDay ? k : b;
            u = f ? this.formatDate(u, v, this._getFormatConfig(a)) : u;
            var w = a.inline ? "" : '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" onclick="DP_jQuery_' +
                dpuuid + '.datepicker._hideDatepicker();">' + this._get(a, "closeText") + "</button>",
                x = d ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (c ? w : "") + (this._isInRange(a, v) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" onclick="DP_jQuery_' + dpuuid + ".datepicker._gotoToday('#" + a.id + "');\"" + ">" + u + "</button>" : "") + (c ? "" : w) + "</div>" : "",
                y = parseInt(this._get(a, "firstDay"), 10);
            y = isNaN(y) ? 0 : y;
            var z = this._get(a, "showWeek"),
                A = this._get(a, "dayNames"),
                B = this._get(a, "dayNamesShort"),
                C = this._get(a, "dayNamesMin"),
                D = this._get(a, "monthNames"),
                E = this._get(a, "monthNamesShort"),
                F = this._get(a, "beforeShowDay"),
                G = this._get(a, "showOtherMonths"),
                H = this._get(a, "selectOtherMonths"),
                I = this._get(a, "calculateWeek") || this.iso8601Week,
                J = this._getDefaultDate(a),
                K = "";
            for (var L = 0; L < g[0]; L++) {
                var M = "";
                this.maxRows = 4;
                for (var N = 0; N < g[1]; N++) {
                    var O = this._daylightSavingAdjust(new Date(o, n, a.selectedDay)),
                        P = " ui-corner-all",
                        Q = "";
                    if (j) {
                        Q += '<div class="ui-datepicker-group';
                        if (g[1] > 1) switch (N) {
                            case 0:
                                Q += " ui-datepicker-group-first", P = " ui-corner-" + (c ? "right" : "left");
                                break;
                            case g[1] - 1:
                                Q += " ui-datepicker-group-last", P = " ui-corner-" + (c ? "left" : "right");
                                break;
                            default:
                                Q += " ui-datepicker-group-middle", P = ""
                        }
                        Q += '">'
                    }
                    Q += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + P + '">' + (/all|left/.test(P) && L == 0 ? c ? t : r : "") + (/all|right/.test(P) && L == 0 ? c ? r : t : "") + this._generateMonthYearHeader(a, n, o, l, m, L > 0 || N > 0, D, E) + '</div><table class="ui-datepicker-calendar"><thead>' + "<tr>";
                    var R = z ? '<th class="ui-datepicker-week-col">' + this._get(a, "weekHeader") + "</th>" : "";
                    for (var S = 0; S < 7; S++) {
                        var T = (S + y) % 7;
                        R += "<th" + ((S + y + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + ">" + '<span title="' + A[T] + '">' + C[T] + "</span></th>"
                    }
                    Q += R + "</tr></thead><tbody>";
                    var U = this._getDaysInMonth(o, n);
                    o == a.selectedYear && n == a.selectedMonth && (a.selectedDay = Math.min(a.selectedDay, U));
                    var V = (this._getFirstDayOfMonth(o, n) - y + 7) % 7,
                        W = Math.ceil((V + U) / 7),
                        X = j ? this.maxRows > W ? this.maxRows : W : W;
                    this.maxRows = X;
                    var Y = this._daylightSavingAdjust(new Date(o,
                        n, 1 - V));
                    for (var Z = 0; Z < X; Z++) {
                        Q += "<tr>";
                        var _ = z ? '<td class="ui-datepicker-week-col">' + this._get(a, "calculateWeek")(Y) + "</td>" : "";
                        for (var S = 0; S < 7; S++) {
                            var ba = F ? F.apply(a.input ? a.input[0] : null, [Y]) : [!0, ""],
                                bb = Y.getMonth() != n,
                                bc = bb && !H || !ba[0] || l && Y < l || m && Y > m;
                            _ += '<td class="' + ((S + y + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (bb ? " ui-datepicker-other-month" : "") + (Y.getTime() == O.getTime() && n == a.selectedMonth && a._keyEvent || J.getTime() == Y.getTime() && J.getTime() == O.getTime() ? " " + this._dayOverClass : "") + (bc ? " " + this._unselectableClass +
                                " ui-state-disabled" : "") + (bb && !G ? "" : " " + ba[1] + (Y.getTime() == k.getTime() ? " " + this._currentClass : "") + (Y.getTime() == b.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!bb || G) && ba[2] ? ' title="' + ba[2] + '"' : "") + (bc ? "" : ' onclick="DP_jQuery_' + dpuuid + ".datepicker._selectDay('#" + a.id + "'," + Y.getMonth() + "," + Y.getFullYear() + ', this);return false;"') + ">" + (bb && !G ? "&#xa0;" : bc ? '<span class="ui-state-default">' + Y.getDate() + "</span>" : '<a class="ui-state-default' + (Y.getTime() == b.getTime() ? " ui-state-highlight" : "") + (Y.getTime() ==
                                k.getTime() ? " ui-state-active" : "") + (bb ? " ui-priority-secondary" : "") + '" href="#">' + Y.getDate() + "</a>") + "</td>", Y.setDate(Y.getDate() + 1), Y = this._daylightSavingAdjust(Y)
                        }
                        Q += _ + "</tr>"
                    }
                    n++, n > 11 && (n = 0, o++), Q += "</tbody></table>" + (j ? "</div>" + (g[0] > 0 && N == g[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : ""), M += Q
                }
                K += M
            }
            K += x + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !a.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""), a._keyEvent = !1;
            return K
        },
        _generateMonthYearHeader: function(a,
            b, c, d, e, f, g, h) {
            var i = this._get(a, "changeMonth"),
                j = this._get(a, "changeYear"),
                k = this._get(a, "showMonthAfterYear"),
                l = '<div class="ui-datepicker-title">',
                m = "";
            if (f || !i) m += '<span class="ui-datepicker-month">' + g[b] + "</span>";
            else {
                var n = d && d.getFullYear() == c,
                    o = e && e.getFullYear() == c;
                m += '<select class="ui-datepicker-month" onchange="DP_jQuery_' + dpuuid + ".datepicker._selectMonthYear('#" + a.id + "', this, 'M');\" " + ">";
                for (var p = 0; p < 12; p++)(!n || p >= d.getMonth()) && (!o || p <= e.getMonth()) && (m += '<option value="' + p + '"' +
                    (p == b ? ' selected="selected"' : "") + ">" + h[p] + "</option>");
                m += "</select>"
            }
            k || (l += m + (f || !i || !j ? "&#xa0;" : ""));
            if (!a.yearshtml) {
                a.yearshtml = "";
                if (f || !j) l += '<span class="ui-datepicker-year">' + c + "</span>";
                else {
                    var q = this._get(a, "yearRange").split(":"),
                        r = (new Date).getFullYear(),
                        s = function(a) {
                            var b = a.match(/c[+-].*/) ? c + parseInt(a.substring(1), 10) : a.match(/[+-].*/) ? r + parseInt(a, 10) : parseInt(a, 10);
                            return isNaN(b) ? r : b
                        },
                        t = s(q[0]),
                        u = Math.max(t, s(q[1] || ""));
                    t = d ? Math.max(t, d.getFullYear()) : t, u = e ? Math.min(u, e.getFullYear()) :
                        u, a.yearshtml += '<select class="ui-datepicker-year" onchange="DP_jQuery_' + dpuuid + ".datepicker._selectMonthYear('#" + a.id + "', this, 'Y');\" " + ">";
                    for (; t <= u; t++) a.yearshtml += '<option value="' + t + '"' + (t == c ? ' selected="selected"' : "") + ">" + t + "</option>";
                    a.yearshtml += "</select>", l += a.yearshtml, a.yearshtml = null
                }
            }
            l += this._get(a, "yearSuffix"), k && (l += (f || !i || !j ? "&#xa0;" : "") + m), l += "</div>";
            return l
        },
        _adjustInstDate: function(a, b, c) {
            var d = a.drawYear + (c == "Y" ? b : 0),
                e = a.drawMonth + (c == "M" ? b : 0),
                f = Math.min(a.selectedDay,
                    this._getDaysInMonth(d, e)) + (c == "D" ? b : 0),
                g = this._restrictMinMax(a, this._daylightSavingAdjust(new Date(d, e, f)));
            a.selectedDay = g.getDate(), a.drawMonth = a.selectedMonth = g.getMonth(), a.drawYear = a.selectedYear = g.getFullYear(), (c == "M" || c == "Y") && this._notifyChange(a)
        },
        _restrictMinMax: function(a, b) {
            var c = this._getMinMaxDate(a, "min"),
                d = this._getMinMaxDate(a, "max"),
                e = c && b < c ? c : b;
            e = d && e > d ? d : e;
            return e
        },
        _notifyChange: function(a) {
            var b = this._get(a, "onChangeMonthYear");
            b && b.apply(a.input ? a.input[0] : null, [a.selectedYear,
                a.selectedMonth + 1, a
            ])
        },
        _getNumberOfMonths: function(a) {
            var b = this._get(a, "numberOfMonths");
            return b == null ? [1, 1] : typeof b == "number" ? [1, b] : b
        },
        _getMinMaxDate: function(a, b) {
            return this._determineDate(a, this._get(a, b + "Date"), null)
        },
        _getDaysInMonth: function(a, b) {
            return 32 - this._daylightSavingAdjust(new Date(a, b, 32)).getDate()
        },
        _getFirstDayOfMonth: function(a, b) {
            return (new Date(a, b, 1)).getDay()
        },
        _canAdjustMonth: function(a, b, c, d) {
            var e = this._getNumberOfMonths(a),
                f = this._daylightSavingAdjust(new Date(c, d + (b <
                    0 ? b : e[0] * e[1]), 1));
            b < 0 && f.setDate(this._getDaysInMonth(f.getFullYear(), f.getMonth()));
            return this._isInRange(a, f)
        },
        _isInRange: function(a, b) {
            var c = this._getMinMaxDate(a, "min"),
                d = this._getMinMaxDate(a, "max");
            return (!c || b.getTime() >= c.getTime()) && (!d || b.getTime() <= d.getTime())
        },
        _getFormatConfig: function(a) {
            var b = this._get(a, "shortYearCutoff");
            b = typeof b != "string" ? b : (new Date).getFullYear() % 100 + parseInt(b, 10);
            return {
                shortYearCutoff: b,
                dayNamesShort: this._get(a, "dayNamesShort"),
                dayNames: this._get(a, "dayNames"),
                monthNamesShort: this._get(a, "monthNamesShort"),
                monthNames: this._get(a, "monthNames")
            }
        },
        _formatDate: function(a, b, c, d) {
            b || (a.currentDay = a.selectedDay, a.currentMonth = a.selectedMonth, a.currentYear = a.selectedYear);
            var e = b ? typeof b == "object" ? b : this._daylightSavingAdjust(new Date(d, c, b)) : this._daylightSavingAdjust(new Date(a.currentYear, a.currentMonth, a.currentDay));
            return this.formatDate(this._get(a, "dateFormat"), e, this._getFormatConfig(a))
        }
    }), $.fn.datepicker = function(a) {
        if (!this.length) return this;
        $.datepicker.initialized ||
            ($(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv), $.datepicker.initialized = !0);
        var b = Array.prototype.slice.call(arguments, 1);
        if (typeof a == "string" && (a == "isDisabled" || a == "getDate" || a == "widget")) return $.datepicker["_" + a + "Datepicker"].apply($.datepicker, [this[0]].concat(b));
        if (a == "option" && arguments.length == 2 && typeof arguments[1] == "string") return $.datepicker["_" + a + "Datepicker"].apply($.datepicker, [this[0]].concat(b));
        return this.each(function() {
            typeof a ==
                "string" ? $.datepicker["_" + a + "Datepicker"].apply($.datepicker, [this].concat(b)) : $.datepicker._attachDatepicker(this, a)
        })
    }, $.datepicker = new Datepicker, $.datepicker.initialized = !1, $.datepicker.uuid = (new Date).getTime(), $.datepicker.version = "1.8.17", window["DP_jQuery_" + dpuuid] = $
})(jQuery);
(function(a, b) {
    a.widget("ui.progressbar", {
        options: {
            value: 0,
            max: 100
        },
        min: 0,
        _create: function() {
            this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({
                role: "progressbar",
                "aria-valuemin": this.min,
                "aria-valuemax": this.options.max,
                "aria-valuenow": this._value()
            }), this.valueDiv = a("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element), this.oldValue = this._value(), this._refreshValue()
        },
        destroy: function() {
            this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"),
                this.valueDiv.remove(), a.Widget.prototype.destroy.apply(this, arguments)
        },
        value: function(a) {
            if (a === b) return this._value();
            this._setOption("value", a);
            return this
        },
        _setOption: function(b, c) {
            b === "value" && (this.options.value = c, this._refreshValue(), this._value() === this.options.max && this._trigger("complete")), a.Widget.prototype._setOption.apply(this, arguments)
        },
        _value: function() {
            var a = this.options.value;
            typeof a != "number" && (a = 0);
            return Math.min(this.options.max, Math.max(this.min, a))
        },
        _percentage: function() {
            return 100 *
                this._value() / this.options.max
        },
        _refreshValue: function() {
            var a = this.value(),
                b = this._percentage();
            this.oldValue !== a && (this.oldValue = a, this._trigger("change")), this.valueDiv.toggle(a > this.min).toggleClass("ui-corner-right", a === this.options.max).width(b.toFixed(0) + "%"), this.element.attr("aria-valuenow", a)
        }
    }), a.extend(a.ui.progressbar, {
        version: "1.8.17"
    })
})(jQuery);
jQuery.effects || function(a, b) {
    function l(b) {
        if (!b || typeof b == "number" || a.fx.speeds[b]) return !0;
        if (typeof b == "string" && !a.effects[b]) return !0;
        return !1
    }

    function k(b, c, d, e) {
        typeof b == "object" && (e = c, d = null, c = b, b = c.effect), a.isFunction(c) && (e = c, d = null, c = {});
        if (typeof c == "number" || a.fx.speeds[c]) e = d, d = c, c = {};
        a.isFunction(d) && (e = d, d = null), c = c || {}, d = d || c.duration, d = a.fx.off ? 0 : typeof d == "number" ? d : d in a.fx.speeds ? a.fx.speeds[d] : a.fx.speeds._default, e = e || c.complete;
        return [b, c, d, e]
    }

    function j(a, b) {
        var c = {
                _: 0
            },
            d;
        for (d in b) a[d] != b[d] && (c[d] = b[d]);
        return c
    }

    function i(b) {
        var c, d;
        for (c in b) d = b[c], (d == null || a.isFunction(d) || c in g || /scrollbar/.test(c) || !/color/i.test(c) && isNaN(parseFloat(d))) && delete b[c];
        return b
    }

    function h() {
        var a = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle,
            b = {},
            c, d;
        if (a && a.length && a[0] && a[a[0]]) {
            var e = a.length;
            while (e--) c = a[e], typeof a[c] == "string" && (d = c.replace(/\-(\w)/g, function(a, b) {
                return b.toUpperCase()
            }), b[d] = a[c])
        } else
            for (c in a) typeof a[c] ==
                "string" && (b[c] = a[c]);
        return b
    }

    function d(b, d) {
        var e;
        do {
            e = a.curCSS(b, d);
            if (e != "" && e != "transparent" || a.nodeName(b, "body")) break;
            d = "backgroundColor"
        } while (b = b.parentNode);
        return c(e)
    }

    function c(b) {
        var c;
        if (b && b.constructor == Array && b.length == 3) return b;
        if (c = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(b)) return [parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10)];
        if (c = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(b)) return [parseFloat(c[1]) *
            2.55, parseFloat(c[2]) * 2.55, parseFloat(c[3]) * 2.55
        ];
        if (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(b)) return [parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16)];
        if (c = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(b)) return [parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16)];
        if (c = /rgba\(0, 0, 0, 0\)/.exec(b)) return e.transparent;
        return e[a.trim(b).toLowerCase()]
    }
    a.effects = {}, a.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor",
        "borderColor", "color", "outlineColor"
    ], function(b, e) {
        a.fx.step[e] = function(a) {
            a.colorInit || (a.start = d(a.elem, e), a.end = c(a.end), a.colorInit = !0), a.elem.style[e] = "rgb(" + Math.max(Math.min(parseInt(a.pos * (a.end[0] - a.start[0]) + a.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(a.pos * (a.end[1] - a.start[1]) + a.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(a.pos * (a.end[2] - a.start[2]) + a.start[2], 10), 255), 0) + ")"
        }
    });
    var e = {
            aqua: [0, 255, 255],
            azure: [240, 255, 255],
            beige: [245, 245, 220],
            black: [0, 0, 0],
            blue: [0, 0,
                255
            ],
            brown: [165, 42, 42],
            cyan: [0, 255, 255],
            darkblue: [0, 0, 139],
            darkcyan: [0, 139, 139],
            darkgrey: [169, 169, 169],
            darkgreen: [0, 100, 0],
            darkkhaki: [189, 183, 107],
            darkmagenta: [139, 0, 139],
            darkolivegreen: [85, 107, 47],
            darkorange: [255, 140, 0],
            darkorchid: [153, 50, 204],
            darkred: [139, 0, 0],
            darksalmon: [233, 150, 122],
            darkviolet: [148, 0, 211],
            fuchsia: [255, 0, 255],
            gold: [255, 215, 0],
            green: [0, 128, 0],
            indigo: [75, 0, 130],
            khaki: [240, 230, 140],
            lightblue: [173, 216, 230],
            lightcyan: [224, 255, 255],
            lightgreen: [144, 238, 144],
            lightgrey: [211, 211, 211],
            lightpink: [255,
                182, 193
            ],
            lightyellow: [255, 255, 224],
            lime: [0, 255, 0],
            magenta: [255, 0, 255],
            maroon: [128, 0, 0],
            navy: [0, 0, 128],
            olive: [128, 128, 0],
            orange: [255, 165, 0],
            pink: [255, 192, 203],
            purple: [128, 0, 128],
            violet: [128, 0, 128],
            red: [255, 0, 0],
            silver: [192, 192, 192],
            white: [255, 255, 255],
            yellow: [255, 255, 0],
            transparent: [255, 255, 255]
        },
        f = ["add", "remove", "toggle"],
        g = {
            border: 1,
            borderBottom: 1,
            borderColor: 1,
            borderLeft: 1,
            borderRight: 1,
            borderTop: 1,
            borderWidth: 1,
            margin: 1,
            padding: 1
        };
    a.effects.animateClass = function(b, c, d, e) {
        a.isFunction(d) && (e = d,
            d = null);
        return this.queue(function() {
            var g = a(this),
                k = g.attr("style") || " ",
                l = i(h.call(this)),
                m, n = g.attr("class");
            a.each(f, function(a, c) {
                b[c] && g[c + "Class"](b[c])
            }), m = i(h.call(this)), g.attr("class", n), g.animate(j(l, m), {
                queue: !1,
                duration: c,
                easing: d,
                complete: function() {
                    a.each(f, function(a, c) {
                        b[c] && g[c + "Class"](b[c])
                    }), typeof g.attr("style") == "object" ? (g.attr("style").cssText = "", g.attr("style").cssText = k) : g.attr("style", k), e && e.apply(this, arguments), a.dequeue(this)
                }
            })
        })
    }, a.fn.extend({
        _addClass: a.fn.addClass,
        addClass: function(b, c, d, e) {
            return c ? a.effects.animateClass.apply(this, [{
                add: b
            }, c, d, e]) : this._addClass(b)
        },
        _removeClass: a.fn.removeClass,
        removeClass: function(b, c, d, e) {
            return c ? a.effects.animateClass.apply(this, [{
                remove: b
            }, c, d, e]) : this._removeClass(b)
        },
        _toggleClass: a.fn.toggleClass,
        toggleClass: function(c, d, e, f, g) {
            return typeof d == "boolean" || d === b ? e ? a.effects.animateClass.apply(this, [d ? {
                add: c
            } : {
                remove: c
            }, e, f, g]) : this._toggleClass(c, d) : a.effects.animateClass.apply(this, [{
                toggle: c
            }, d, e, f])
        },
        switchClass: function(b,
            c, d, e, f) {
            return a.effects.animateClass.apply(this, [{
                add: c,
                remove: b
            }, d, e, f])
        }
    }), a.extend(a.effects, {
        version: "1.8.17",
        save: function(a, b) {
            for (var c = 0; c < b.length; c++) b[c] !== null && a.data("ec.storage." + b[c], a[0].style[b[c]])
        },
        restore: function(a, b) {
            for (var c = 0; c < b.length; c++) b[c] !== null && a.css(b[c], a.data("ec.storage." + b[c]))
        },
        setMode: function(a, b) {
            b == "toggle" && (b = a.is(":hidden") ? "show" : "hide");
            return b
        },
        getBaseline: function(a, b) {
            var c, d;
            switch (a[0]) {
                case "top":
                    c = 0;
                    break;
                case "middle":
                    c = .5;
                    break;
                case "bottom":
                    c =
                        1;
                    break;
                default:
                    c = a[0] / b.height
            }
            switch (a[1]) {
                case "left":
                    d = 0;
                    break;
                case "center":
                    d = .5;
                    break;
                case "right":
                    d = 1;
                    break;
                default:
                    d = a[1] / b.width
            }
            return {
                x: d,
                y: c
            }
        },
        createWrapper: function(b) {
            if (b.parent().is(".ui-effects-wrapper")) return b.parent();
            var c = {
                    width: b.outerWidth(!0),
                    height: b.outerHeight(!0),
                    "float": b.css("float")
                },
                d = a("<div></div>").addClass("ui-effects-wrapper").css({
                    fontSize: "100%",
                    background: "transparent",
                    border: "none",
                    margin: 0,
                    padding: 0
                }),
                e = document.activeElement;
            b.wrap(d), (b[0] === e || a.contains(b[0],
                e)) && a(e).focus(), d = b.parent(), b.css("position") == "static" ? (d.css({
                position: "relative"
            }), b.css({
                position: "relative"
            })) : (a.extend(c, {
                position: b.css("position"),
                zIndex: b.css("z-index")
            }), a.each(["top", "left", "bottom", "right"], function(a, d) {
                c[d] = b.css(d), isNaN(parseInt(c[d], 10)) && (c[d] = "auto")
            }), b.css({
                position: "relative",
                top: 0,
                left: 0,
                right: "auto",
                bottom: "auto"
            }));
            return d.css(c).show()
        },
        removeWrapper: function(b) {
            var c, d = document.activeElement;
            if (b.parent().is(".ui-effects-wrapper")) {
                c = b.parent().replaceWith(b), (b[0] === d || a.contains(b[0], d)) && a(d).focus();
                return c
            }
            return b
        },
        setTransition: function(b, c, d, e) {
            e = e || {}, a.each(c, function(a, c) {
                unit = b.cssUnit(c), unit[0] > 0 && (e[c] = unit[0] * d + unit[1])
            });
            return e
        }
    }), a.fn.extend({
        effect: function(b, c, d, e) {
            var f = k.apply(this, arguments),
                g = {
                    options: f[1],
                    duration: f[2],
                    callback: f[3]
                },
                h = g.options.mode,
                i = a.effects[b];
            if (a.fx.off || !i) return h ? this[h](g.duration, g.callback) : this.each(function() {
                g.callback && g.callback.call(this)
            });
            return i.call(this, g)
        },
        _show: a.fn.show,
        show: function(a) {
            if (l(a)) return this._show.apply(this,
                arguments);
            var b = k.apply(this, arguments);
            b[1].mode = "show";
            return this.effect.apply(this, b)
        },
        _hide: a.fn.hide,
        hide: function(a) {
            if (l(a)) return this._hide.apply(this, arguments);
            var b = k.apply(this, arguments);
            b[1].mode = "hide";
            return this.effect.apply(this, b)
        },
        __toggle: a.fn.toggle,
        toggle: function(b) {
            if (l(b) || typeof b == "boolean" || a.isFunction(b)) return this.__toggle.apply(this, arguments);
            var c = k.apply(this, arguments);
            c[1].mode = "toggle";
            return this.effect.apply(this, c)
        },
        cssUnit: function(b) {
            var c = this.css(b),
                d = [];
            a.each(["em", "px", "%", "pt"], function(a, b) {
                c.indexOf(b) > 0 && (d = [parseFloat(c), b])
            });
            return d
        }
    }), a.easing.jswing = a.easing.swing, a.extend(a.easing, {
        def: "easeOutQuad",
        swing: function(b, c, d, e, f) {
            return a.easing[a.easing.def](b, c, d, e, f)
        },
        easeInQuad: function(a, b, c, d, e) {
            return d * (b /= e) * b + c
        },
        easeOutQuad: function(a, b, c, d, e) {
            return -d * (b /= e) * (b - 2) + c
        },
        easeInOutQuad: function(a, b, c, d, e) {
            if ((b /= e / 2) < 1) return d / 2 * b * b + c;
            return -d / 2 * (--b * (b - 2) - 1) + c
        },
        easeInCubic: function(a, b, c, d, e) {
            return d * (b /= e) * b * b + c
        },
        easeOutCubic: function(a,
            b, c, d, e) {
            return d * ((b = b / e - 1) * b * b + 1) + c
        },
        easeInOutCubic: function(a, b, c, d, e) {
            if ((b /= e / 2) < 1) return d / 2 * b * b * b + c;
            return d / 2 * ((b -= 2) * b * b + 2) + c
        },
        easeInQuart: function(a, b, c, d, e) {
            return d * (b /= e) * b * b * b + c
        },
        easeOutQuart: function(a, b, c, d, e) {
            return -d * ((b = b / e - 1) * b * b * b - 1) + c
        },
        easeInOutQuart: function(a, b, c, d, e) {
            if ((b /= e / 2) < 1) return d / 2 * b * b * b * b + c;
            return -d / 2 * ((b -= 2) * b * b * b - 2) + c
        },
        easeInQuint: function(a, b, c, d, e) {
            return d * (b /= e) * b * b * b * b + c
        },
        easeOutQuint: function(a, b, c, d, e) {
            return d * ((b = b / e - 1) * b * b * b * b + 1) + c
        },
        easeInOutQuint: function(a,
            b, c, d, e) {
            if ((b /= e / 2) < 1) return d / 2 * b * b * b * b * b + c;
            return d / 2 * ((b -= 2) * b * b * b * b + 2) + c
        },
        easeInSine: function(a, b, c, d, e) {
            return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
        },
        easeOutSine: function(a, b, c, d, e) {
            return d * Math.sin(b / e * (Math.PI / 2)) + c
        },
        easeInOutSine: function(a, b, c, d, e) {
            return -d / 2 * (Math.cos(Math.PI * b / e) - 1) + c
        },
        easeInExpo: function(a, b, c, d, e) {
            return b == 0 ? c : d * Math.pow(2, 10 * (b / e - 1)) + c
        },
        easeOutExpo: function(a, b, c, d, e) {
            return b == e ? c + d : d * (-Math.pow(2, -10 * b / e) + 1) + c
        },
        easeInOutExpo: function(a, b, c, d, e) {
            if (b == 0) return c;
            if (b ==
                e) return c + d;
            if ((b /= e / 2) < 1) return d / 2 * Math.pow(2, 10 * (b - 1)) + c;
            return d / 2 * (-Math.pow(2, -10 * --b) + 2) + c
        },
        easeInCirc: function(a, b, c, d, e) {
            return -d * (Math.sqrt(1 - (b /= e) * b) - 1) + c
        },
        easeOutCirc: function(a, b, c, d, e) {
            return d * Math.sqrt(1 - (b = b / e - 1) * b) + c
        },
        easeInOutCirc: function(a, b, c, d, e) {
            if ((b /= e / 2) < 1) return -d / 2 * (Math.sqrt(1 - b * b) - 1) + c;
            return d / 2 * (Math.sqrt(1 - (b -= 2) * b) + 1) + c
        },
        easeInElastic: function(a, b, c, d, e) {
            var f = 1.70158,
                g = 0,
                h = d;
            if (b == 0) return c;
            if ((b /= e) == 1) return c + d;
            g || (g = e * .3);
            if (h < Math.abs(d)) {
                h = d;
                var f = g / 4
            } else var f =
                g / (2 * Math.PI) * Math.asin(d / h);
            return -(h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g)) + c
        },
        easeOutElastic: function(a, b, c, d, e) {
            var f = 1.70158,
                g = 0,
                h = d;
            if (b == 0) return c;
            if ((b /= e) == 1) return c + d;
            g || (g = e * .3);
            if (h < Math.abs(d)) {
                h = d;
                var f = g / 4
            } else var f = g / (2 * Math.PI) * Math.asin(d / h);
            return h * Math.pow(2, -10 * b) * Math.sin((b * e - f) * 2 * Math.PI / g) + d + c
        },
        easeInOutElastic: function(a, b, c, d, e) {
            var f = 1.70158,
                g = 0,
                h = d;
            if (b == 0) return c;
            if ((b /= e / 2) == 2) return c + d;
            g || (g = e * .3 * 1.5);
            if (h < Math.abs(d)) {
                h = d;
                var f = g / 4
            } else var f = g /
                (2 * Math.PI) * Math.asin(d / h);
            if (b < 1) return -.5 * h * Math.pow(2, 10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) + c;
            return h * Math.pow(2, -10 * (b -= 1)) * Math.sin((b * e - f) * 2 * Math.PI / g) * .5 + d + c
        },
        easeInBack: function(a, c, d, e, f, g) {
            g == b && (g = 1.70158);
            return e * (c /= f) * c * ((g + 1) * c - g) + d
        },
        easeOutBack: function(a, c, d, e, f, g) {
            g == b && (g = 1.70158);
            return e * ((c = c / f - 1) * c * ((g + 1) * c + g) + 1) + d
        },
        easeInOutBack: function(a, c, d, e, f, g) {
            g == b && (g = 1.70158);
            if ((c /= f / 2) < 1) return e / 2 * c * c * (((g *= 1.525) + 1) * c - g) + d;
            return e / 2 * ((c -= 2) * c * (((g *= 1.525) + 1) * c + g) + 2) + d
        },
        easeInBounce: function(b,
            c, d, e, f) {
            return e - a.easing.easeOutBounce(b, f - c, 0, e, f) + d
        },
        easeOutBounce: function(a, b, c, d, e) {
            return (b /= e) < 1 / 2.75 ? d * 7.5625 * b * b + c : b < 2 / 2.75 ? d * (7.5625 * (b -= 1.5 / 2.75) * b + .75) + c : b < 2.5 / 2.75 ? d * (7.5625 * (b -= 2.25 / 2.75) * b + .9375) + c : d * (7.5625 * (b -= 2.625 / 2.75) * b + .984375) + c
        },
        easeInOutBounce: function(b, c, d, e, f) {
            if (c < f / 2) return a.easing.easeInBounce(b, c * 2, 0, e, f) * .5 + d;
            return a.easing.easeOutBounce(b, c * 2 - f, 0, e, f) * .5 + e * .5 + d
        }
    })
}(jQuery);
(function(a, b) {
    a.effects.highlight = function(b) {
        return this.queue(function() {
            var c = a(this),
                d = ["backgroundImage", "backgroundColor", "opacity"],
                e = a.effects.setMode(c, b.options.mode || "show"),
                f = {
                    backgroundColor: c.css("backgroundColor")
                };
            e == "hide" && (f.opacity = 0), a.effects.save(c, d), c.show().css({
                backgroundImage: "none",
                backgroundColor: b.options.color || "#ffff99"
            }).animate(f, {
                queue: !1,
                duration: b.duration,
                easing: b.options.easing,
                complete: function() {
                    e == "hide" && c.hide(), a.effects.restore(c, d), e == "show" && !a.support.opacity &&
                        this.style.removeAttribute("filter"), b.callback && b.callback.apply(this, arguments), c.dequeue()
                }
            })
        })
    }
})(jQuery);
jQuery.extend(jQuery.easing, {
    easeInQuad: function(x, t, b, c, d) {
        return c * (t /= d) * t + b
    },
    easeOutQuad: function(x, t, b, c, d) {
        return -c * (t /= d) * (t - 2) + b
    },
    easeInOutQuad: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * (--t * (t - 2) - 1) + b
    },
    easeInCubic: function(x, t, b, c, d) {
        return c * (t /= d) * t * t + b
    },
    easeOutCubic: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b
    },
    easeInOutCubic: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b
    },
    easeInQuart: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t + b
    },
    easeOutQuart: function(x, t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b
    },
    easeInOutQuart: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
    },
    easeInQuint: function(x, t, b, c, d) {
        return c * (t /= d) * t * t * t * t + b
    },
    easeOutQuint: function(x, t, b, c, d) {
        return c * ((t = t / d - 1) * t * t * t * t + 1) + b
    },
    easeInOutQuint: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b
    },
    easeInSine: function(x, t, b, c, d) {
        return -c * Math.cos(t / d * (Math.PI / 2)) + c + b
    },
    easeOutSine: function(x, t, b, c, d) {
        return c *
            Math.sin(t / d * (Math.PI / 2)) + b
    },
    easeInOutSine: function(x, t, b, c, d) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b
    },
    easeInExpo: function(x, t, b, c, d) {
        return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b
    },
    easeOutExpo: function(x, t, b, c, d) {
        return t == d ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b
    },
    easeInOutExpo: function(x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b
    },
    easeInCirc: function(x, t, b, c, d) {
        return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b
    },
    easeOutCirc: function(x,
        t, b, c, d) {
        return c * Math.sqrt(1 - (t = t / d - 1) * t) + b
    },
    easeInOutCirc: function(x, t, b, c, d) {
        if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
        return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b
    },
    easeInElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b
    },
    easeOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d) == 1) return b + c;
        if (!p) p = d * .3;
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b
    },
    easeInOutElastic: function(x, t, b, c, d) {
        var s = 1.70158;
        var p = 0;
        var a = c;
        if (t == 0) return b;
        if ((t /= d / 2) == 2) return b + c;
        if (!p) p = d * (.3 * 1.5);
        if (a < Math.abs(c)) {
            a = c;
            var s = p / 4
        } else var s = p / (2 * Math.PI) * Math.asin(c / a);
        if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 *
            Math.PI) / p) * .5 + c + b
    },
    easeInBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * (t /= d) * t * ((s + 1) * t - s) + b
    },
    easeOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b
    },
    easeInOutBack: function(x, t, b, c, d, s) {
        if (s == undefined) s = 1.70158;
        if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
        return c / 2 * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b
    },
    easeInBounce: function(x, t, b, c, d) {
        return c - jQuery.easing.easeOutBounce(x, d - t, 0, c, d) + b
    },
    easeOutBounce: function(x, t, b, c, d) {
        if ((t /=
                d) < 1 / 2.75) return c * (7.5625 * t * t) + b;
        else if (t < 2 / 2.75) return c * (7.5625 * (t -= 1.5 / 2.75) * t + .75) + b;
        else if (t < 2.5 / 2.75) return c * (7.5625 * (t -= 2.25 / 2.75) * t + .9375) + b;
        else return c * (7.5625 * (t -= 2.625 / 2.75) * t + .984375) + b
    },
    easeInOutBounce: function(x, t, b, c, d) {
        if (t < d / 2) return jQuery.easing.easeInBounce(x, t * 2, 0, c, d) * .5 + b;
        return jQuery.easing.easeOutBounce(x, t * 2 - d, 0, c, d) * .5 + c * .5 + b
    }
});
(function($) {
    $.fn.bgIframe = $.fn.bgiframe = function(s) {
        if ($.browser.msie && parseInt($.browser.version) <= 6) {
            s = $.extend({
                top: "auto",
                left: "auto",
                width: "auto",
                height: "auto",
                opacity: true,
                src: "javascript:false;"
            }, s || {});
            var prop = function(n) {
                    return n && n.constructor == Number ? n + "px" : n
                },
                html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="' + s.src + '"' + 'style="display:block;position:absolute;z-index:-1;' + (s.opacity !== false ? "filter:Alpha(Opacity='0');" : "") + "top:" + (s.top == "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+'px')" :
                    prop(s.top)) + ";" + "left:" + (s.left == "auto" ? "expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+'px')" : prop(s.left)) + ";" + "width:" + (s.width == "auto" ? "expression(this.parentNode.offsetWidth+'px')" : prop(s.width)) + ";" + "height:" + (s.height == "auto" ? "expression(this.parentNode.offsetHeight+'px')" : prop(s.height)) + ";" + '"/>';
            return this.each(function() {
                if ($("> iframe.bgiframe", this).length == 0) this.insertBefore(document.createElement(html), this.firstChild)
            })
        }
        return this
    };
    if (!$.browser.version) $.browser.version =
        navigator.userAgent.toLowerCase().match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/)[1]
})(jQuery);
(function($) {
    var helper = {},
        current, title, tID, IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
        track = false;
    /*$.tooltip = {
        blocked: false,
        defaults: {
            delay: 200,
            showURL: true,
            extraClass: "",
            top: 15,
            left: 15,
            id: "tooltip"
        },
        block: function() {
            $.tooltip.blocked = !$.tooltip.blocked
        }
    };*/
    $.fn.extend({
        /*tooltip: function(settings) {
            settings = $.extend({}, $.tooltip.defaults, settings);
            createHelper(settings);
            return this.each(function() {
                $.data(this, "tooltip-settings", settings);
                this.tooltipText = this.title;
                $(this).removeAttr("title");
                this.alt = ""
            }).hover(save, hide).click(hide)
        },*/
        fixPNG: IE ? function() {
            return this.each(function() {
                var image = $(this).css("backgroundImage");
                if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
                    image = RegExp.$1;
                    $(this).css({
                        "backgroundImage": "none",
                        "filter": "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
                    }).each(function() {
                        var position = $(this).css("position");
                        if (position != "absolute" && position != "relative") $(this).css("position", "relative")
                    })
                }
            })
        } : function() {
            return this
        },
        unfixPNG: IE ? function() {
            return this.each(function() {
                $(this).css({
                    "filter": "",
                    backgroundImage: ""
                })
            })
        } : function() {
            return this
        },
        hideWhenEmpty: function() {
            return this.each(function() {
                $(this)[$(this).html() ? "show" : "hide"]()
            })
        },
        url: function() {
            return this.attr("href") || this.attr("src")
        }
    });

    function createHelper(settings) {
        if (helper.parent) return;
        helper.parent = $('<div id="' + settings.id + '"><h3></h3><div class="body"></div><div class="url"></div></div>').appendTo(document.body).hide();
        if ($.fn.bgiframe) helper.parent.bgiframe();
        helper.title = $("h3", helper.parent);
        helper.body = $("div.body", helper.parent);
        helper.url = $("div.url", helper.parent)
    }

    function settings(element) {
        return $.data(element, "tooltip-settings")
    }

    function handle(event) {
        if (settings(this).delay) tID = setTimeout(show, settings(this).delay);
        else show();
        track = !!settings(this).track;
        $(document.body).bind("mousemove", update);
        update(event)
    }

    function save() {
        if ($.tooltip.blocked || this == current || !this.tooltipText && !settings(this).bodyHandler) return;
        current = this;
        title = this.tooltipText;
        if (settings(this).bodyHandler) {
            helper.title.hide();
            var bodyContent = settings(this).bodyHandler.call(this);
            if (bodyContent.nodeType || bodyContent.jquery) helper.body.empty().append(bodyContent);
            else helper.body.html(bodyContent);
            helper.body.show()
        } else if (settings(this).showBody) {
            var parts = title.split(settings(this).showBody);
            helper.title.html(parts.shift()).show();
            helper.body.empty();
            for (var i = 0, part; part = parts[i]; i++) {
                if (i > 0) helper.body.append("<br/>");
                helper.body.append(part)
            }
            helper.body.hideWhenEmpty()
        } else {
            helper.title.html(title).show();
            helper.body.hide()
        }
        if (settings(this).showURL && $(this).url()) helper.url.html($(this).url().replace("http://", "")).show();
        else helper.url.hide();
        helper.parent.addClass(settings(this).extraClass);
        if (settings(this).fixPNG) helper.parent.fixPNG();
        handle.apply(this, arguments)
    }

    function show() {
        tID = null;
        helper.parent.show();
        update()
    }

    function update(event) {
        if ($.tooltip.blocked) return;
        if (!track && helper.parent.is(":visible")) $(document.body).unbind("mousemove", update);
        if (current == null) {
            $(document.body).unbind("mousemove",
                update);
            return
        }
        helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
        var left = helper.parent[0].offsetLeft;
        var top = helper.parent[0].offsetTop;
        if (event) {
            left = event.pageX + settings(current).left;
            top = event.pageY + settings(current).top;
            helper.parent.css({
                left: left + "px",
                top: top + "px"
            })
        }
        var v = viewport(),
            h = helper.parent[0];
        if (v.x + v.cx < h.offsetLeft + h.offsetWidth) {
            left -= h.offsetWidth + 20 + settings(current).left;
            helper.parent.css({
                left: left + "px"
            }).addClass("viewport-right")
        }
        if (v.y + v.cy < h.offsetTop +
            h.offsetHeight) {
            top -= h.offsetHeight + 20 + settings(current).top;
            helper.parent.css({
                top: top + "px"
            }).addClass("viewport-bottom")
        }
    }

    function viewport() {
        return {
            x: $(window).scrollLeft(),
            y: $(window).scrollTop(),
            cx: $(window).width(),
            cy: $(window).height()
        }
    }

    function hide(event) {
        if ($.tooltip.blocked) return;
        if (tID) clearTimeout(tID);
        current = null;
        helper.parent.hide().removeClass(settings(this).extraClass);
        if (settings(this).fixPNG) helper.parent.unfixPNG()
    }
    $.fn.Tooltip = $.fn.tooltip
})(jQuery);
(function($) {
    var o = $.scrollTo = function(a, b, c) {
        o.window().scrollTo(a, b, c)
    };
    o.defaults = {
        axis: "y",
        duration: 1
    };
    o.window = function() {
        return $($.browser.safari ? "body" : "html")
    };
    $.fn.scrollTo = function(l, m, n) {
        if (typeof m == "object") {
            n = m;
            m = 0
        }
        n = $.extend({}, o.defaults, n);
        m = m || n.speed || n.duration;
        n.queue = n.queue && n.axis.length > 1;
        if (n.queue) m /= 2;
        n.offset = j(n.offset);
        n.over = j(n.over);
        return this.each(function() {
            var a = this,
                b = $(a),
                t = l,
                c, d = {},
                w = b.is("html,body");
            switch (typeof t) {
                case "number":
                case "string":
                    if (/^([+-]=)?\d+(px)?$/.test(t)) {
                        t =
                            j(t);
                        break
                    }
                    t = $(t, this);
                case "object":
                    if (t.is || t.style) c = (t = $(t)).offset()
            }
            $.each(n.axis.split(""), function(i, f) {
                var P = f == "x" ? "Left" : "Top",
                    p = P.toLowerCase(),
                    k = "scroll" + P,
                    e = a[k],
                    D = f == "x" ? "Width" : "Height";
                if (c) {
                    d[k] = c[p] + (w ? 0 : e - b.offset()[p]);
                    if (n.margin) {
                        d[k] -= parseInt(t.css("margin" + P)) || 0;
                        d[k] -= parseInt(t.css("border" + P + "Width")) || 0
                    }
                    d[k] += n.offset[p] || 0;
                    if (n.over[p]) d[k] += t[D.toLowerCase()]() * n.over[p]
                } else d[k] = t[p];
                if (/^\d+$/.test(d[k])) d[k] = d[k] <= 0 ? 0 : Math.min(d[k], h(D));
                if (!i && n.queue) {
                    if (e != d[k]) g(n.onAfterFirst);
                    delete d[k]
                }
            });
            g(n.onAfter);

            function g(a) {
                b.animate(d, m, n.easing, a && function() {
                    a.call(this, l)
                })
            }

            function h(D) {
                var b = w ? $.browser.opera ? document.body : document.documentElement : a;
                return b["scroll" + D] - b["client" + D]
            }
        })
    };

    function j(a) {
        return typeof a == "object" ? a : {
            top: a,
            left: a
        }
    }
})(jQuery);

// MODAL
(function($) {
    $.fn.jqm = function(o) {
        /*
        var p = {
            overlay: 50,
            overlayClass: "jqmOverlay",
            closeClass: "jqmClose",
            trigger: ".jqModal",
            ajax: F,
            ajaxText: "",
            target: F,
            modal: F,
            toTop: F,
            onShow: F,
            onHide: F,
            onLoad: F
        };
        return this.each(function() {
            if (this._jqm) return H[this._jqm].c = $.extend({}, H[this._jqm].c, o);
            s++;
            this._jqm = s;
            H[s] = {
                c: $.extend(p, $.jqm.params, o),
                a: F,
                w: $(this).addClass("jqmID" + s),
                s: s
            };
            if (p.trigger) $(this).jqmAddTrigger(p.trigger)
        })
        */
        console.log('jqm INIT function()');
    };
    $.fn.jqmAddClose = function(e) {
        return hs(this, e, "jqmHide")
    };
    $.fn.jqmAddTrigger = function(e) {
        return hs(this,
            e, "jqmShow")
    };
    $.fn.jqmShow = function(t) {
        console.log('jqmShow function()');
        /*return this.each(function() {
            $.jqm.open(this._jqm, t)
        })*/
    };
    $.fn.jqmHide = function(t) {
        return this.each(function() {
            //$.jqm.close(this._jqm, t)
            $(this).modal('hide');
        })
    };
    $.jqm = {
        //console.log('jqm function()');
        /*
        hash: {},
        open: function(s, t) {
            var h = H[s],
                c = h.c,
                cc = "." + c.closeClass,
                z = parseInt(h.w.css("z-index")),
                z = z > 0 ? z : 3E3,
                o = $("<div></div>").css({
                    height: "100%",
                    width: "100%",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    "z-index": z - 1,
                    opacity: c.overlay / 100
                });
            if (h.a) return F;
            h.t = t;
            h.a = true;
            h.w.css("z-index", z);
            if (c.modal) {
                if (!A[0]) L("bind");
                A.push(s)
            } else if (c.overlay >
                0) h.w.jqmAddClose(o);
            else o = F;
            h.o = o ? o.addClass(c.overlayClass).prependTo("body") : F;
            if (ie6) {
                $("html,body").css({
                    height: "100%",
                    width: "100%"
                });
                if (o) {
                    o = o.css({
                        position: "absolute"
                    })[0];
                    for (var y in {
                            Top: 1,
                            Left: 1
                        }) o.style.setExpression(y.toLowerCase(), "(_=(document.documentElement.scroll" + y + " || document.body.scroll" + y + "))+'px'")
                }
            }
            if (c.ajax) {
                var r = c.target || h.w,
                    u = c.ajax,
                    r = typeof r == "string" ? $(r, h.w) : $(r),
                    u = u.substr(0, 1) == "@" ? $(t).attr(u.substring(1)) : u;
                r.html(c.ajaxText).load(u, function() {
                    if (c.onLoad) c.onLoad.call(this,
                        h);
                    if (cc) h.w.jqmAddClose($(cc, h.w));
                    e(h)
                })
            } else if (cc) h.w.jqmAddClose($(cc, h.w));
            if (c.toTop && h.o) h.w.before('<span id="jqmP' + h.w[0]._jqm + '"></span>').insertAfter(h.o);
            c.onShow ? c.onShow(h) : h.w.show();
            e(h);
            return F
        },
        close: function(s) {
            var h = H[s];
            if (!h.a) return F;
            h.a = F;
            if (A[0]) {
                A.pop();
                if (!A[0]) L("unbind")
            }
            if (h.c.toTop && h.o) $("#jqmP" + h.w[0]._jqm).after(h.w).remove();
            if (h.c.onHide) h.c.onHide(h);
            else {
                h.w.hide();
                if (h.o) h.o.remove()
            }
            return F
        },
        params: {}
        */
    };
    /*var s = 0,
        H = $.jqm.hash,
        A = [],
        ie6 = $.browser.msie && $.browser.version ==
        "6.0",
        F = false,
        i = $('<iframe src="javascript:false;document.write(\'\');" class="jqm"></iframe>').css({
            opacity: 0
        }),
        e = function(h) {
            if (ie6)
                if (h.o) h.o.html('<p style="width:100%;height:100%"/>').prepend(i);
                else if (!$("iframe.jqm", h.w)[0]) h.w.prepend(i);
            f(h)
        },
        f = function(h) {
            try {
                $(":input:visible", h.w)[0].focus()
            } catch (_) {}
        },
        L = function(t) {
            $()[t]("keypress", m)[t]("keydown", m)[t]("mousedown", m)
        },
        m = function(e) {
            var h = H[A[A.length - 1]],
                r = !$(e.target).parents(".jqmID" + h.s)[0];
            if (r) f(h);
            return !r
        },
        hs = function(w, t,
            c) {
            return w.each(function() {
                var s = this._jqm;
                $(t).each(function() {
                    if (!this[c]) {
                        this[c] = [];
                        $(this).click(function() {
                            for (var i in {
                                    jqmShow: 1,
                                    jqmHide: 1
                                })
                                for (var s in this[i])
                                    if (H[this[i][s]]) H[this[i][s]].w[i](this);
                            return F
                        })
                    }
                    this[c].push(s)
                })
            })
        }
        */
})(jQuery);

jQuery.checksave = function(context) {
    var pageVals = {};
    var _this = this;
    var $elems = jQuery("input:text, input:checked, textarea, select", context);
    $elems.each(function(i) {
        jQuery(this).data("checksaveStartValue", jQuery(this).val())
    });
    window.onbeforeunload = function(e) {
        var msg = "";
        var changedMsg = "You are about to lose unsaved data. Do you want to continue?";
        $elems.each(function(i) {
            if (jQuery(this).data("checksaveStartValue") != undefined && jQuery(this).data("checksaveStartValue").toString() != jQuery(this).val().toString()) {
                msg =
                    changedMsg;
                return changedMsg
            }
        });
        if (msg.length) return msg
    }
};
jQuery.removeChecksave = function() {
    window.onbeforeunload = null
};
jQuery.removeChecksaveValue = function(elem) {
    jQuery(elem).data("checksaveStartValue", null)
};
jQuery.changeChecksaveValue = function(elem, val) {
    jQuery(elem).data("checksaveStartValue", val)
};
jQuery.refreshChecksaveValue = function(elem) {
    var val = jQuery(elem).val();
    jQuery.changeChecksaveValue(elem, val)
};
(function($) {
    jQuery.fn.checksave = function(o) {
        return this.each(function() {})
    }
})(jQuery);
(function($) {
    $.fn.ajaxSubmit = function(options) {
        if (!this.length) {
            log("ajaxSubmit: skipping submit process - no element selected");
            return this
        }
        var method, action, url, $form = this;
        if (typeof options == "function") options = {
            success: options
        };
        method = this.attr("method");
        action = this.attr("action");
        url = typeof action === "string" ? $.trim(action) : "";
        url = url || window.location.href || "";
        if (url) url = (url.match(/^([^#]+)/) || [])[1];
        options = $.extend(true, {
            url: url,
            success: $.ajaxSettings.success,
            type: method || "GET",
            iframeSrc: /^https/i.test(window.location.href ||
                "") ? "javascript:false" : "about:blank"
        }, options);
        var veto = {};
        this.trigger("form-pre-serialize", [this, options, veto]);
        if (veto.veto) {
            log("ajaxSubmit: submit vetoed via form-pre-serialize trigger");
            return this
        }
        if (options.beforeSerialize && options.beforeSerialize(this, options) === false) {
            log("ajaxSubmit: submit aborted via beforeSerialize callback");
            return this
        }
        var traditional = options.traditional;
        if (traditional === undefined) traditional = $.ajaxSettings.traditional;
        var qx, n, v, a = this.formToArray(options.semantic);
        if (options.data) {
            options.extraData = options.data;
            qx = $.param(options.data, traditional)
        }
        if (options.beforeSubmit && options.beforeSubmit(a, this, options) === false) {
            log("ajaxSubmit: submit aborted via beforeSubmit callback");
            return this
        }
        this.trigger("form-submit-validate", [a, this, options, veto]);
        if (veto.veto) {
            log("ajaxSubmit: submit vetoed via form-submit-validate trigger");
            return this
        }
        var q = $.param(a, traditional);
        if (qx) q = q ? q + "&" + qx : qx;
        if (options.type.toUpperCase() == "GET") {
            options.url += (options.url.indexOf("?") >=
                0 ? "&" : "?") + q;
            options.data = null
        } else options.data = q;
        var callbacks = [];
        if (options.resetForm) callbacks.push(function() {
            $form.resetForm()
        });
        if (options.clearForm) callbacks.push(function() {
            $form.clearForm(options.includeHidden)
        });
        if (!options.dataType && options.target) {
            var oldSuccess = options.success || function() {};
            callbacks.push(function(data) {
                var fn = options.replaceTarget ? "replaceWith" : "html";
                $(options.target)[fn](data).each(oldSuccess, arguments)
            })
        } else if (options.success) callbacks.push(options.success);
        options.success =
            function(data, status, xhr) {
                var context = options.context || options;
                for (var i = 0, max = callbacks.length; i < max; i++) callbacks[i].apply(context, [data, status, xhr || $form, $form])
            };
        var fileInputs = $("input:file:enabled[value]", this);
        var hasFileInputs = fileInputs.length > 0;
        var mp = "multipart/form-data";
        var multipart = $form.attr("enctype") == mp || $form.attr("encoding") == mp;
        var fileAPI = !!(hasFileInputs && fileInputs.get(0).files && window.FormData);
        log("fileAPI :" + fileAPI);
        var shouldUseFrame = (hasFileInputs || multipart) && !fileAPI;
        if (options.iframe !== false && (options.iframe || shouldUseFrame))
            if (options.closeKeepAlive) $.get(options.closeKeepAlive, function() {
                fileUploadIframe(a)
            });
            else fileUploadIframe(a);
        else if ((hasFileInputs || multipart) && fileAPI) {
            options.progress = options.progress || $.noop;
            fileUploadXhr(a)
        } else $.ajax(options);
        this.trigger("form-submit-notify", [this, options]);
        return this;

        function fileUploadXhr(a) {
            var formdata = new FormData;
            for (var i = 0; i < a.length; i++) {
                if (a[i].type == "file") continue;
                formdata.append(a[i].name, a[i].value)
            }
            $form.find("input:file:enabled").each(function() {
                var name =
                    $(this).attr("name"),
                    files = this.files;
                if (name)
                    for (var i = 0; i < files.length; i++) formdata.append(name, files[i])
            });
            options.data = null;
            var _beforeSend = options.beforeSend;
            options.beforeSend = function(xhr, options) {
                options.data = formdata;
                if (xhr.upload) xhr.upload.onprogress = function(event) {
                    options.progress(event.position, event.total)
                };
                if (_beforeSend) _beforeSend.call(options, xhr, options)
            };
            $.ajax(options)
        }

        function fileUploadIframe(a) {
            var form = $form[0],
                el, i, s, g, id, $io, io, xhr, sub, n, timedOut, timeoutHandle;
            var useProp = !!$.fn.prop;
            if (a)
                if (useProp)
                    for (i = 0; i < a.length; i++) {
                        el = $(form[a[i].name]);
                        el.prop("disabled", false)
                    } else
                        for (i = 0; i < a.length; i++) {
                            el = $(form[a[i].name]);
                            el.removeAttr("disabled")
                        }
                if ($(":input[name=submit],:input[id=submit]", form).length) {
                    alert('Error: Form elements must not have name or id of "submit".');
                    return
                }
            s = $.extend(true, {}, $.ajaxSettings, options);
            s.context = s.context || s;
            id = "jqFormIO" + (new Date).getTime();
            if (s.iframeTarget) {
                $io = $(s.iframeTarget);
                n = $io.attr("name");
                if (n == null) $io.attr("name", id);
                else id = n
            } else {
                $io = $('<iframe name="' + id + '" src="' + s.iframeSrc + '" />');
                $io.css({
                    position: "absolute",
                    top: "-1000px",
                    left: "-1000px"
                })
            }
            io = $io[0];
            xhr = {
                aborted: 0,
                responseText: null,
                responseXML: null,
                status: 0,
                statusText: "n/a",
                getAllResponseHeaders: function() {},
                getResponseHeader: function() {},
                setRequestHeader: function() {},
                abort: function(status) {
                    var e = status === "timeout" ? "timeout" : "aborted";
                    log("aborting upload... " + e);
                    this.aborted = 1;
                    $io.attr("src", s.iframeSrc);
                    xhr.error = e;
                    s.error && s.error.call(s.context, xhr,
                        e, status);
                    g && $.event.trigger("ajaxError", [xhr, s, e]);
                    s.complete && s.complete.call(s.context, xhr, e)
                }
            };
            g = s.global;
            if (g && !$.active++) $.event.trigger("ajaxStart");
            if (g) $.event.trigger("ajaxSend", [xhr, s]);
            if (s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false) {
                if (s.global) $.active--;
                return
            }
            if (xhr.aborted) return;
            sub = form.clk;
            if (sub) {
                n = sub.name;
                if (n && !sub.disabled) {
                    s.extraData = s.extraData || {};
                    s.extraData[n] = sub.value;
                    if (sub.type == "image") {
                        s.extraData[n + ".x"] = form.clk_x;
                        s.extraData[n + ".y"] = form.clk_y
                    }
                }
            }
            var CLIENT_TIMEOUT_ABORT =
                1;
            var SERVER_ABORT = 2;

            function getDoc(frame) {
                var doc = frame.contentWindow ? frame.contentWindow.document : frame.contentDocument ? frame.contentDocument : frame.document;
                return doc
            }
            var csrf_token = $("meta[name=csrf-token]").attr("content");
            var csrf_param = $("meta[name=csrf-param]").attr("content");
            if (csrf_param && csrf_token) {
                s.extraData = s.extraData || {};
                s.extraData[csrf_param] = csrf_token
            }

            function doSubmit() {
                var t = $form.attr("target"),
                    a = $form.attr("action");
                form.setAttribute("target", id);
                if (!method) form.setAttribute("method",
                    "POST");
                if (a != s.url) form.setAttribute("action", s.url);
                if (!s.skipEncodingOverride && (!method || /post/i.test(method))) $form.attr({
                    encoding: "multipart/form-data",
                    enctype: "multipart/form-data"
                });
                if (s.timeout) timeoutHandle = setTimeout(function() {
                    timedOut = true;
                    cb(CLIENT_TIMEOUT_ABORT)
                }, s.timeout);

                function checkState() {
                    try {
                        var state = getDoc(io).readyState;
                        log("state = " + state);
                        if (state.toLowerCase() == "uninitialized") setTimeout(checkState, 50)
                    } catch (e) {
                        log("Server abort: ", e, " (", e.name, ")");
                        cb(SERVER_ABORT);
                        timeoutHandle && clearTimeout(timeoutHandle);
                        timeoutHandle = undefined
                    }
                }
                var extraInputs = [];
                try {
                    if (s.extraData)
                        for (var n in s.extraData) extraInputs.push($('<input type="hidden" name="' + n + '">').attr("value", s.extraData[n]).appendTo(form)[0]);
                    if (!s.iframeTarget) {
                        $io.appendTo("body");
                        io.attachEvent ? io.attachEvent("onload", cb) : io.addEventListener("load", cb, false)
                    }
                    setTimeout(checkState, 15);
                    form.submit()
                } finally {
                    form.setAttribute("action", a);
                    if (t) form.setAttribute("target", t);
                    else $form.removeAttr("target");
                    $(extraInputs).remove()
                }
            }
            if (s.forceSync) doSubmit();
            else setTimeout(doSubmit, 10);
            var data, doc, domCheckCount = 50,
                callbackProcessed;

            function cb(e) {
                if (xhr.aborted || callbackProcessed) return;
                try {
                    doc = getDoc(io)
                } catch (ex) {
                    log("cannot access response document: ", ex);
                    e = SERVER_ABORT
                }
                if (e === CLIENT_TIMEOUT_ABORT && xhr) {
                    xhr.abort("timeout");
                    return
                } else if (e == SERVER_ABORT && xhr) {
                    xhr.abort("server abort");
                    return
                }
                if (!doc || doc.location.href == s.iframeSrc)
                    if (!timedOut) return;
                io.detachEvent ? io.detachEvent("onload", cb) : io.removeEventListener("load",
                    cb, false);
                var status = "success",
                    errMsg;
                try {
                    if (timedOut) throw "timeout";
                    var isXml = s.dataType == "xml" || doc.XMLDocument || $.isXMLDoc(doc);
                    log("isXml=" + isXml);
                    if (!isXml && window.opera && (doc.body == null || doc.body.innerHTML == ""))
                        if (--domCheckCount) {
                            log("requeing onLoad callback, DOM not available");
                            setTimeout(cb, 250);
                            return
                        }
                    var docRoot = doc.body ? doc.body : doc.documentElement;
                    xhr.responseText = docRoot ? docRoot.innerHTML : null;
                    xhr.responseXML = doc.XMLDocument ? doc.XMLDocument : doc;
                    if (isXml) s.dataType = "xml";
                    xhr.getResponseHeader =
                        function(header) {
                            var headers = {
                                "content-type": s.dataType
                            };
                            return headers[header]
                        };
                    if (docRoot) {
                        xhr.status = Number(docRoot.getAttribute("status")) || xhr.status;
                        xhr.statusText = docRoot.getAttribute("statusText") || xhr.statusText
                    }
                    var dt = (s.dataType || "").toLowerCase();
                    var scr = /(json|script|text)/.test(dt);
                    if (scr || s.textarea) {
                        var ta = doc.getElementsByTagName("textarea")[0];
                        if (ta) {
                            xhr.responseText = ta.value;
                            xhr.status = Number(ta.getAttribute("status")) || xhr.status;
                            xhr.statusText = ta.getAttribute("statusText") || xhr.statusText
                        } else if (scr) {
                            var pre =
                                doc.getElementsByTagName("pre")[0];
                            var b = doc.getElementsByTagName("body")[0];
                            if (pre) xhr.responseText = pre.textContent ? pre.textContent : pre.innerText;
                            else if (b) xhr.responseText = b.textContent ? b.textContent : b.innerText
                        }
                    } else if (dt == "xml" && !xhr.responseXML && xhr.responseText != null) xhr.responseXML = toXml(xhr.responseText);
                    try {
                        data = httpData(xhr, dt, s)
                    } catch (e) {
                        status = "parsererror";
                        xhr.error = errMsg = e || status
                    }
                } catch (e) {
                    log("error caught: ", e);
                    status = "error";
                    xhr.error = errMsg = e || status
                }
                if (xhr.aborted) {
                    log("upload aborted");
                    status = null
                }
                if (xhr.status) status = xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 ? "success" : "error";
                if (status === "success") {
                    s.success && s.success.call(s.context, data, "success", xhr);
                    g && $.event.trigger("ajaxSuccess", [xhr, s])
                } else if (status) {
                    if (errMsg == undefined) errMsg = xhr.statusText;
                    s.error && s.error.call(s.context, xhr, status, errMsg);
                    g && $.event.trigger("ajaxError", [xhr, s, errMsg])
                }
                g && $.event.trigger("ajaxComplete", [xhr, s]);
                if (g && !--$.active) $.event.trigger("ajaxStop");
                s.complete && s.complete.call(s.context,
                    xhr, status);
                callbackProcessed = true;
                if (s.timeout) clearTimeout(timeoutHandle);
                setTimeout(function() {
                    if (!s.iframeTarget) $io.remove();
                    xhr.responseXML = null
                }, 100)
            }
            var toXml = $.parseXML || function(s, doc) {
                if (window.ActiveXObject) {
                    doc = new ActiveXObject("Microsoft.XMLDOM");
                    doc.async = "false";
                    doc.loadXML(s)
                } else doc = (new DOMParser).parseFromString(s, "text/xml");
                return doc && doc.documentElement && doc.documentElement.nodeName != "parsererror" ? doc : null
            };
            var parseJSON = $.parseJSON || function(s) {
                return window["eval"]("(" +
                    s + ")")
            };
            var httpData = function(xhr, type, s) {
                var ct = xhr.getResponseHeader("content-type") || "",
                    xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
                    data = xml ? xhr.responseXML : xhr.responseText;
                if (xml && data.documentElement.nodeName === "parsererror") $.error && $.error("parsererror");
                if (s && s.dataFilter) data = s.dataFilter(data, type);
                if (typeof data === "string")
                    if (type === "json" || !type && ct.indexOf("json") >= 0) data = parseJSON(data);
                    else if (type === "script" || !type && ct.indexOf("javascript") >= 0) $.globalEval(data);
                return data
            }
        }
    };
    $.fn.ajaxForm = function(options) {
        if (this.length === 0) {
            var o = {
                s: this.selector,
                c: this.context
            };
            if (!$.isReady && o.s) {
                log("DOM not ready, queuing ajaxForm");
                $(function() {
                    $(o.s, o.c).ajaxForm(options)
                });
                return this
            }
            log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
            return this
        }
        return this.ajaxFormUnbind().bind("submit.form-plugin", function(e) {
            if (!e.isDefaultPrevented()) {
                e.preventDefault();
                $(this).ajaxSubmit(options)
            }
        }).bind("click.form-plugin", function(e) {
            var target = e.target;
            var $el = $(target);
            if (!$el.is(":submit,input:image")) {
                var t = $el.closest(":submit");
                if (t.length == 0) return;
                target = t[0]
            }
            var form = this;
            form.clk = target;
            if (target.type == "image")
                if (e.offsetX != undefined) {
                    form.clk_x = e.offsetX;
                    form.clk_y = e.offsetY
                } else if (typeof $.fn.offset == "function") {
                var offset = $el.offset();
                form.clk_x = e.pageX - offset.left;
                form.clk_y = e.pageY - offset.top
            } else {
                form.clk_x = e.pageX - target.offsetLeft;
                form.clk_y = e.pageY - target.offsetTop
            }
            setTimeout(function() {
                form.clk = form.clk_x = form.clk_y = null
            }, 100)
        })
    };
    $.fn.ajaxFormUnbind = function() {
        return this.unbind("submit.form-plugin click.form-plugin")
    };
    $.fn.formToArray = function(semantic) {
        var a = [];
        if (this.length === 0) return a;
        var form = this[0];
        var els = semantic ? form.getElementsByTagName("*") : form.elements;
        if (!els) return a;
        var i, j, n, v, el, max, jmax;
        for (i = 0, max = els.length; i < max; i++) {
            el = els[i];
            n = el.name;
            if (!n) continue;
            if (semantic && form.clk && el.type == "image") {
                if (!el.disabled && form.clk == el) {
                    a.push({
                        name: n,
                        value: $(el).val(),
                        type: el.type
                    });
                    a.push({
                        name: n + ".x",
                        value: form.clk_x
                    }, {
                        name: n + ".y",
                        value: form.clk_y
                    })
                }
                continue
            }
            v = $.fieldValue(el, true);
            if (v && v.constructor == Array)
                for (j = 0, jmax = v.length; j < jmax; j++) a.push({
                    name: n,
                    value: v[j]
                });
            else if (v !== null && typeof v != "undefined") a.push({
                name: n,
                value: v,
                type: el.type
            })
        }
        if (!semantic && form.clk) {
            var $input = $(form.clk),
                input = $input[0];
            n = input.name;
            if (n && !input.disabled && input.type == "image") {
                a.push({
                    name: n,
                    value: $input.val()
                });
                a.push({
                    name: n + ".x",
                    value: form.clk_x
                }, {
                    name: n + ".y",
                    value: form.clk_y
                })
            }
        }
        return a
    };
    $.fn.formSerialize = function(semantic) {
        return $.param(this.formToArray(semantic))
    };
    $.fn.fieldSerialize = function(successful) {
        var a = [];
        this.each(function() {
            var n = this.name;
            if (!n) return;
            var v = $.fieldValue(this, successful);
            if (v && v.constructor == Array)
                for (var i = 0, max = v.length; i < max; i++) a.push({
                    name: n,
                    value: v[i]
                });
            else if (v !== null && typeof v != "undefined") a.push({
                name: this.name,
                value: v
            })
        });
        return $.param(a)
    };
    $.fn.fieldValue = function(successful) {
        for (var val = [], i = 0, max = this.length; i < max; i++) {
            var el = this[i];
            var v = $.fieldValue(el, successful);
            if (v === null || typeof v == "undefined" || v.constructor ==
                Array && !v.length) continue;
            v.constructor == Array ? $.merge(val, v) : val.push(v)
        }
        return val
    };
    $.fieldValue = function(el, successful) {
        var n = el.name,
            t = el.type,
            tag = el.tagName.toLowerCase();
        if (successful === undefined) successful = true;
        if (successful && (!n || el.disabled || t == "reset" || t == "button" || (t == "checkbox" || t == "radio") && !el.checked || (t == "submit" || t == "image") && el.form && el.form.clk != el || tag == "select" && el.selectedIndex == -1)) return null;
        if (tag == "select") {
            var index = el.selectedIndex;
            if (index < 0) return null;
            var a = [],
                ops =
                el.options;
            var one = t == "select-one";
            var max = one ? index + 1 : ops.length;
            for (var i = one ? index : 0; i < max; i++) {
                var op = ops[i];
                if (op.selected) {
                    var v = op.value;
                    if (!v) v = op.attributes && op.attributes["value"] && !op.attributes["value"].specified ? op.text : op.value;
                    if (one) return v;
                    a.push(v)
                }
            }
            return a
        }
        return $(el).val()
    };
    $.fn.clearForm = function(includeHidden) {
        return this.each(function() {
            $("input,select,textarea", this).clearFields(includeHidden)
        })
    };
    $.fn.clearFields = $.fn.clearInputs = function(includeHidden) {
        var re = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function() {
            var t = this.type,
                tag = this.tagName.toLowerCase();
            if (re.test(t) || tag == "textarea" || includeHidden && /hidden/.test(t)) this.value = "";
            else if (t == "checkbox" || t == "radio") this.checked = false;
            else if (tag == "select") this.selectedIndex = -1
        })
    };
    $.fn.resetForm = function() {
        return this.each(function() {
            if (typeof this.reset == "function" || typeof this.reset == "object" && !this.reset.nodeType) this.reset()
        })
    };
    $.fn.enable = function(b) {
        if (b === undefined) b = true;
        return this.each(function() {
            this.disabled = !b
        })
    };
    $.fn.selected = function(select) {
        if (select === undefined) select = true;
        return this.each(function() {
            var t = this.type;
            if (t == "checkbox" || t == "radio") this.checked = select;
            else if (this.tagName.toLowerCase() == "option") {
                var $sel = $(this).parent("select");
                if (select && $sel[0] && $sel[0].type == "select-one") $sel.find("option").selected(false);
                this.selected = select
            }
        })
    };
    $.fn.ajaxSubmit.debug = false;

    function log() {
        if (!$.fn.ajaxSubmit.debug) return;
        var msg = "[jquery.form] " + Array.prototype.join.call(arguments, "");
        if (window.console &&
            window.console.log) window.console.log(msg);
        else if (window.opera && window.opera.postError) window.opera.postError(msg)
    }
})(jQuery);
(function($) {
    $.extend($.fn, {
        swapClass: function(c1, c2) {
            var c1Elements = this.filter("." + c1);
            this.filter("." + c2).removeClass(c2).addClass(c1);
            c1Elements.removeClass(c1).addClass(c2);
            return this
        },
        replaceClass: function(c1, c2) {
            return this.filter("." + c1).removeClass(c1).addClass(c2).end()
        },
        hoverClass: function(className) {
            className = className || "hover";
            return this.hover(function() {
                $(this).addClass(className)
            }, function() {
                $(this).removeClass(className)
            })
        },
        heightToggle: function(animated, callback) {
            animated ? this.animate({
                    height: "toggle"
                },
                animated, callback) : this.each(function() {
                jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"]();
                if (callback) callback.apply(this, arguments)
            })
        },
        heightHide: function(animated, callback) {
            if (animated) this.animate({
                height: "hide"
            }, animated, callback);
            else {
                this.hide();
                if (callback) this.each(callback)
            }
        },
        prepareBranches: function(settings) {
            if (!settings.prerendered) {
                this.filter(":last-child:not(ul)").addClass(CLASSES.last);
                this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide()
            }
            return this.filter(":has(>ul)")
        },
        applyClasses: function(settings, toggler) {
            this.filter(":has(>ul):not(:has(>a))").find(">span").unbind("click.treeview").bind("click.treeview", function(event) {
                if (this == event.target) toggler.apply($(this).next())
            }).add($("a", this)).hoverClass();
            if (!settings.prerendered) {
                this.filter(":has(>ul:hidden)").addClass(CLASSES.expandable).replaceClass(CLASSES.last, CLASSES.lastExpandable);
                this.not(":has(>ul:hidden)").addClass(CLASSES.collapsable).replaceClass(CLASSES.last, CLASSES.lastCollapsable);
                var hitarea = this.find("div." +
                    CLASSES.hitarea);
                if (!hitarea.length) hitarea = this.prepend('<div class="' + CLASSES.hitarea + '"/>').find("div." + CLASSES.hitarea);
                hitarea.removeClass().addClass(CLASSES.hitarea).each(function() {
                    var classes = "";
                    $.each($(this).parent().attr("class").split(" "), function() {
                        classes += this + "-hitarea "
                    });
                    $(this).addClass(classes)
                })
            }
            this.find("div." + CLASSES.hitarea).click(toggler)
        },
        treeview: function(settings) {
            settings = $.extend({
                cookieId: "treeview",
                groupCookieId: "treeview"
            }, settings);
            if (settings.toggle) {
                var callback =
                    settings.toggle;
                settings.toggle = function() {
                    return callback.apply($(this).parent()[0], arguments)
                }
            }

            function treeController(tree, control) {
                function handler(filter) {
                    return function() {
                        toggler.apply($("div." + CLASSES.hitarea, tree).filter(function() {
                            return filter ? $(this).parent("." + filter).length : true
                        }));
                        return false
                    }
                }
                $("a:eq(0)", control).click(handler(CLASSES.collapsable));
                $("a:eq(1)", control).click(handler(CLASSES.expandable));
                $("a:eq(2)", control).click(handler())
            }

            function toggler() {
                $(this).parent().find(">.hitarea").swapClass(CLASSES.collapsableHitarea,
                    CLASSES.expandableHitarea).swapClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea).end().swapClass(CLASSES.collapsable, CLASSES.expandable).swapClass(CLASSES.lastCollapsable, CLASSES.lastExpandable).find(">ul").heightToggle(settings.animated, settings.toggle);
                if (settings.unique) $(this).parent().siblings().find(">.hitarea").replaceClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea).replaceClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea).end().replaceClass(CLASSES.collapsable,
                    CLASSES.expandable).replaceClass(CLASSES.lastCollapsable, CLASSES.lastExpandable).find(">ul").heightHide(settings.animated, settings.toggle)
            }
            this.data("toggler", toggler);

            function serialize() {
                function binary(arg) {
                    return arg ? 1 : 0
                }
                var data = [];
                branches.each(function(i, e) {
                    data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0
                });
                $.supercookie(settings.groupCookieId, settings.cookieId, data.join(""), settings.cookieOptions)
            }

            function deserialize() {
                var stored = $.supercookie(settings.groupCookieId, settings.cookieId);
                if (stored) {
                    var data =
                        stored.split("");
                    branches.each(function(i, e) {
                        $(e).find(">ul")[parseInt(data[i]) ? "show" : "hide"]()
                    })
                }
            }
            this.addClass("treeview");
            var branches = this.find("li").prepareBranches(settings);
            switch (settings.persist) {
                case "cookie":
                    var toggleCallback = settings.toggle;
                    settings.toggle = function() {
                        serialize();
                        if (toggleCallback) toggleCallback.apply(this, arguments)
                    };
                    deserialize();
                    break;
                case "location":
                    var current = this.find("a").filter(function() {
                        return this.href.toLowerCase() == location.href.toLowerCase()
                    });
                    if (current.length) {
                        var items =
                            current.addClass("selected").parents("ul, li").add(current.next()).show();
                        if (settings.prerendered) items.filter("li").swapClass(CLASSES.collapsable, CLASSES.expandable).swapClass(CLASSES.lastCollapsable, CLASSES.lastExpandable).find(">.hitarea").swapClass(CLASSES.collapsableHitarea, CLASSES.expandableHitarea).swapClass(CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea)
                    }
                    break
            }
            branches.applyClasses(settings, toggler);
            if (settings.control) {
                treeController(this, settings.control);
                $(settings.control).show()
            }
            return this
        }
    });
    $.treeview = {};
    var CLASSES = $.treeview.classes = {
        open: "open",
        closed: "closed",
        expandable: "expandable",
        expandableHitarea: "expandable-hitarea",
        lastExpandableHitarea: "lastExpandable-hitarea",
        collapsable: "collapsable",
        collapsableHitarea: "collapsable-hitarea",
        lastCollapsableHitarea: "lastCollapsable-hitarea",
        lastCollapsable: "lastCollapsable",
        lastExpandable: "lastExpandable",
        last: "last",
        hitarea: "hitarea"
    }
})(jQuery);
jQuery.serialize = function(_obj) {
    if (typeof _obj.toSource !== "undefined" && typeof _obj.callee === "undefined") return _obj.toSource();
    switch (typeof _obj) {
        case "number":
        case "boolean":
        case "function":
            return _obj;
            break;
        case "string":
            return '"' + _obj + '"';
            break;
        case "object":
            var str;
            if (_obj.constructor === Array || typeof _obj.callee !== "undefined") {
                str = "[";
                var i, len = _obj.length;
                for (i = 0; i < len - 1; i++) str += jQuery.serialize(_obj[i]) + ",";
                str += serialize(_obj[i]) + "]"
            } else {
                str = "{";
                var key;
                for (key in _obj) str += '"' + key + '":' +
                    jQuery.serialize(_obj[key]) + ",";
                str = str.replace(/\,$/, "") + "}"
            }
            return str;
            break;
        default:
            return "UNKNOWN";
            break
    }
};
jQuery.cookie = function(name, value, options) {
    if (typeof value != "undefined") {
        options = options || {};
        if (value === null) {
            value = "";
            options.expires = -1
        }
        var expires = "";
        if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == "number") {
                date = new Date;
                date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1E3)
            } else date = options.expires;
            expires = "; expires=" + date.toUTCString()
        }
        var path = options.path ? "; path=" + options.path : "";
        var domain = options.domain ? "; domain=" +
            options.domain : "";
        var secure = options.secure ? "; secure" : "";
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("")
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break
                }
            }
        }
        return cookieValue
    }
};
jQuery.supercookie = function(name, key, value, options) {
    if (typeof value != "undefined") {
        var cookieObj = jQuery.supercookie(name);
        cookieObj[key] = value;
        var cookieVal = escape(jQuery.serialize(cookieObj));
        jQuery.cookie(name, cookieVal, options)
    } else {
        var cookie = jQuery.cookie(name);
        var cookieObj = null;
        if (cookie) eval("cookieObj = " + unescape(cookie));
        if (!cookieObj) cookieObj = {};
        if (key)
            if (cookieObj[key]) return cookieObj[key];
            else return null;
        else return cookieObj
    }
};
(function(jQuery) {
    jQuery.hotkeys = {
        version: "0.8",
        specialKeys: {
            8: "backspace",
            9: "tab",
            13: "return",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            191: "/",
            224: "meta"
        },
        shiftNums: {
            "`": "~",
            1: "!",
            2: "@",
            3: "#",
            4: "$",
            5: "%",
            6: "^",
            7: "&",
            8: "*",
            9: "(",
            0: ")",
            "-": "_",
            "=": "+",
            ";": ": ",
            "'": '"',
            ",": "<",
            ".": ">",
            "/": "?",
            "\\": "|"
        }
    };

    function keyHandler(handleObj) {
        if (typeof handleObj.data !== "string") return;
        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(" ");
        handleObj.handler = function(event) {
            if (this !== event.target && (/textarea|select/i.test(event.target.nodeName) || event.target.type === "text")) return;
            var special =
                event.type !== "keypress" && jQuery.hotkeys.specialKeys[event.which],
                character = String.fromCharCode(event.which).toLowerCase(),
                key, modif = "",
                possible = {};
            if (event.altKey && special !== "alt") modif += "alt+";
            if (event.ctrlKey && special !== "ctrl") modif += "ctrl+";
            if (event.metaKey && !event.ctrlKey && special !== "meta") modif += "meta+";
            if (event.shiftKey && special !== "shift") modif += "shift+";
            if (special) possible[modif + special] = true;
            else {
                possible[modif + character] = true;
                possible[modif + jQuery.hotkeys.shiftNums[character]] = true;
                if (modif ===
                    "shift+") possible[jQuery.hotkeys.shiftNums[character]] = true
            }
            for (var i = 0, l = keys.length; i < l; i++)
                if (possible[keys[i]]) return origHandler.apply(this, arguments)
        }
    }
    jQuery.each(["keydown", "keyup", "keypress"], function() {
        jQuery.event.special[this] = {
            add: keyHandler
        }
    })
})(jQuery);
jQuery.cookie = function(name, value, options) {
    if (typeof value != "undefined") {
        options = options || {};
        if (value === null) {
            value = "";
            options.expires = -1
        }
        var expires = "";
        if (options.expires && (typeof options.expires == "number" || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == "number") {
                date = new Date;
                date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1E3)
            } else date = options.expires;
            expires = "; expires=" + date.toUTCString()
        }
        var path = options.path ? "; path=" + options.path : "";
        var domain = options.domain ? "; domain=" +
            options.domain : "";
        var secure = options.secure ? "; secure" : "";
        document.cookie = [name, "=", encodeURIComponent(value), expires, path, domain, secure].join("")
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != "") {
            var cookies = document.cookie.split(";");
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == name + "=") {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break
                }
            }
        }
        return cookieValue
    }
};
(function($) {
    jQuery.fn.simpleTab = function(settings) {
        var s = jQuery.extend({
            startIndex: 0,
            childrenSelector: null,
            cookie: false
        }, settings);
        var activeTab = null;
        var activeContent = null;
        var hasCookie = s.cookie && s.cookie.group && s.cookie.name;
        return this.each(function() {
            var _this = this;
            $(this).find("a").each(function(i) {
                var id = $(this).attr("href");
                $(id).hide()
            });
            $children = s.childrenSelector ? $(this).find(s.childrenSelector) : $(this).children();
            $children.click(function() {
                $this = $(this);
                var index = $this.index();
                if (isNaN(index)) index =
                    0;
                if (!activeTab || $this.find("a").attr("href") != activeTab.find("a").attr("href")) {
                    if (activeTab) activeTab.removeClass("active");
                    if (activeContent) activeContent.hide();
                    $this.addClass("active");
                    var id = $(this).find("a").attr("href");
                    activeContent = $(id);
                    activeContent.show();
                    activeTab = $this;
                    $(_this).trigger("tabClicked", [index, activeTab, activeContent, s]);
                    if (hasCookie) $.supercookie(s.cookie.group, s.cookie.name, index.toString(), s.cookie.params);
                    else s.startIndex = 0
                }
                return false
            });
            if (hasCookie) s.startIndex = parseInt($.supercookie(s.cookie.group,
                s.cookie.name));
            if (isNaN(s.startIndex) || $children.size() - 1 < s.startIndex) s.startIndex = 0;
            $(this).children().eq(s.startIndex).click();
            return this
        })
    }
})(jQuery);
jQuery.tableDnD = {
    currentTable: null,
    dragObject: null,
    mouseOffset: null,
    oldY: 0,
    build: function(options) {
        this.each(function() {
            this.tableDnDConfig = jQuery.extend({
                onDragStyle: null,
                onDropStyle: null,
                onDragClass: "tDnD_whileDrag",
                onDrop: null,
                onDragStart: null,
                scrollAmount: 5,
                serializeRegexp: /[^\-]*$/,
                serializeParamName: null,
                dragHandle: null
            }, options || {});
            jQuery.tableDnD.makeDraggable(this)
        });
        jQuery(document).bind("mousemove", jQuery.tableDnD.mousemove).bind("mouseup", jQuery.tableDnD.mouseup);
        return this
    },
    makeDraggable: function(table) {
        var config =
            table.tableDnDConfig;
        if (table.tableDnDConfig.dragHandle) {
            var cells = jQuery("td." + table.tableDnDConfig.dragHandle, table);
            cells.each(function() {
                jQuery(this).mousedown(function(ev) {
                    jQuery.tableDnD.dragObject = this.parentNode;
                    jQuery.tableDnD.currentTable = table;
                    jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(this, ev);
                    if (config.onDragStart) config.onDragStart(table, this);
                    return false
                })
            })
        } else {
            var rows = jQuery("tr", table);
            rows.each(function() {
                var row = jQuery(this);
                if (!row.hasClass("nodrag")) row.mousedown(function(ev) {
                    if (ev.target.tagName ==
                        "TD") {
                        jQuery.tableDnD.dragObject = this;
                        jQuery.tableDnD.currentTable = table;
                        jQuery.tableDnD.mouseOffset = jQuery.tableDnD.getMouseOffset(this, ev);
                        if (config.onDragStart) config.onDragStart(table, this);
                        return false
                    }
                }).css("cursor", "move")
            })
        }
    },
    updateTables: function() {
        this.each(function() {
            if (this.tableDnDConfig) jQuery.tableDnD.makeDraggable(this)
        })
    },
    mouseCoords: function(ev) {
        if (ev.pageX || ev.pageY) return {
            x: ev.pageX,
            y: ev.pageY
        };
        return {
            x: ev.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: ev.clientY +
                document.body.scrollTop - document.body.clientTop
        }
    },
    getMouseOffset: function(target, ev) {
        ev = ev || window.event;
        var docPos = this.getPosition(target);
        var mousePos = this.mouseCoords(ev);
        return {
            x: mousePos.x - docPos.x,
            y: mousePos.y - docPos.y
        }
    },
    getPosition: function(e) {
        var left = 0;
        var top = 0;
        if (e.offsetHeight == 0) e = e.firstChild;
        while (e.offsetParent) {
            left += e.offsetLeft;
            top += e.offsetTop;
            e = e.offsetParent
        }
        left += e.offsetLeft;
        top += e.offsetTop;
        return {
            x: left,
            y: top
        }
    },
    mousemove: function(ev) {
        if (jQuery.tableDnD.dragObject == null) return;
        var dragObj = jQuery(jQuery.tableDnD.dragObject);
        var config = jQuery.tableDnD.currentTable.tableDnDConfig;
        var mousePos = jQuery.tableDnD.mouseCoords(ev);
        var y = mousePos.y - jQuery.tableDnD.mouseOffset.y;
        var yOffset = window.pageYOffset;
        if (document.all)
            if (typeof document.compatMode != "undefined" && document.compatMode != "BackCompat") yOffset = document.documentElement.scrollTop;
            else if (typeof document.body != "undefined") yOffset = document.body.scrollTop;
        if (mousePos.y - yOffset < config.scrollAmount) window.scrollBy(0, -config.scrollAmount);
        else {
            var windowHeight = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
            if (windowHeight - (mousePos.y - yOffset) < config.scrollAmount) window.scrollBy(0, config.scrollAmount)
        }
        if (y != jQuery.tableDnD.oldY) {
            var movingDown = y > jQuery.tableDnD.oldY;
            jQuery.tableDnD.oldY = y;
            if (config.onDragClass) dragObj.addClass(config.onDragClass);
            else dragObj.css(config.onDragStyle);
            var currentRow = jQuery.tableDnD.findDropTargetRow(dragObj,
                y);
            if (currentRow)
                if (movingDown && jQuery.tableDnD.dragObject != currentRow) try {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow.nextSibling)
                } catch (e) {} else if (!movingDown && jQuery.tableDnD.dragObject != currentRow) try {
                    jQuery.tableDnD.dragObject.parentNode.insertBefore(jQuery.tableDnD.dragObject, currentRow)
                } catch (e) {}
        }
        return false
    },
    findDropTargetRow: function(draggedRow, y) {
        var rows = jQuery.tableDnD.currentTable.rows;
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var rowY =
                this.getPosition(row).y;
            var rowHeight = parseInt(row.offsetHeight) / 2;
            if (row.offsetHeight == 0) {
                rowY = this.getPosition(row.firstChild).y;
                rowHeight = parseInt(row.firstChild.offsetHeight) / 2
            }
            if (y > rowY - rowHeight && y < rowY + rowHeight) {
                if (row == draggedRow) return null;
                var config = jQuery.tableDnD.currentTable.tableDnDConfig;
                if (config.onAllowDrop)
                    if (config.onAllowDrop(draggedRow, row)) return row;
                    else return null;
                else {
                    var nodrop = jQuery(row).hasClass("nodrop");
                    if (!nodrop) return row;
                    else return null
                }
                return row
            }
        }
        return null
    },
    mouseup: function(e) {
        if (jQuery.tableDnD.currentTable && jQuery.tableDnD.dragObject) {
            var droppedRow = jQuery.tableDnD.dragObject;
            var config = jQuery.tableDnD.currentTable.tableDnDConfig;
            if (config.onDragClass) jQuery(droppedRow).removeClass(config.onDragClass);
            else jQuery(droppedRow).css(config.onDropStyle);
            jQuery.tableDnD.dragObject = null;
            if (config.onDrop) config.onDrop(jQuery.tableDnD.currentTable, droppedRow);
            jQuery.tableDnD.currentTable = null
        }
    },
    serialize: function() {
        if (jQuery.tableDnD.currentTable) return jQuery.tableDnD.serializeTable(jQuery.tableDnD.currentTable);
        else return "Error: No Table id set, you need to set an id on your table and every row"
    },
    serializeTable: function(table) {
        var result = "";
        var tableId = table.id;
        var rows = table.rows;
        for (var i = 0; i < rows.length; i++) {
            if (result.length > 0) result += "&";
            var rowId = rows[i].id;
            if (rowId && rowId && table.tableDnDConfig && table.tableDnDConfig.serializeRegexp) rowId = rowId.match(table.tableDnDConfig.serializeRegexp)[0];
            result += tableId + "[]=" + rowId
        }
        return result
    },
    serializeTables: function() {
        var result = "";
        this.each(function() {
            result +=
                jQuery.tableDnD.serializeTable(this)
        });
        return result
    }
};
jQuery.fn.extend({
    tableDnD: jQuery.tableDnD.build,
    tableDnDUpdate: jQuery.tableDnD.updateTables,
    tableDnDSerialize: jQuery.tableDnD.serializeTables
});
(function(f, h, $) {
    var a = "placeholder" in h.createElement("input"),
        d = "placeholder" in h.createElement("textarea"),
        i = $.fn,
        c = $.valHooks,
        k, j;
    if (a && d) {
        j = i.placeholder = function() {
            return this
        };
        j.input = j.textarea = true
    } else {
        j = i.placeholder = function() {
            return this.filter((a ? "textarea" : ":input") + "[placeholder]").not(".placeholder").bind({
                "focus.placeholder": b,
                "blur.placeholder": e
            }).data("placeholder-enabled", true).trigger("blur.placeholder").end()
        };
        j.input = a;
        j.textarea = d;
        k = {
            get: function(m) {
                var l = $(m);
                return l.data("placeholder-enabled") &&
                    l.hasClass("placeholder") ? "" : m.value
            },
            set: function(m, n) {
                var l = $(m);
                if (!l.data("placeholder-enabled")) return m.value = n;
                if (n == "") {
                    m.value = n;
                    e.call(m)
                } else if (l.hasClass("placeholder")) b.call(m, true, n) || (m.value = n);
                else m.value = n;
                return l
            }
        };
        a || (c.input = k);
        d || (c.textarea = k);
        $(function() {
            $(h).delegate("form", "submit.placeholder", function() {
                var l = $(".placeholder", this).each(b);
                setTimeout(function() {
                    l.each(e)
                }, 10)
            })
        });
        $(f).bind("beforeunload.placeholder", function() {
            $(".placeholder").each(function() {
                this.value =
                    ""
            })
        })
    }

    function g(m) {
        var l = {},
            n = /^jQuery\d+$/;
        $.each(m.attributes, function(p, o) {
            if (o.specified && !n.test(o.name)) l[o.name] = o.value
        });
        return l
    }

    function b(m, n) {
        var l = this,
            o = $(l);
        if (l.value == o.attr("placeholder") && o.hasClass("placeholder"))
            if (o.data("placeholder-password")) {
                o = o.hide().next().show().attr("id", o.removeAttr("id").data("placeholder-id"));
                if (m === true) return o[0].value = n;
                o.focus()
            } else {
                l.value = "";
                o.removeClass("placeholder")
            }
    }

    function e() {
        var q, l = this,
            p = $(l),
            m = p,
            o = this.id;
        if (l.value == "") {
            if (l.type ==
                "password") {
                if (!p.data("placeholder-textinput")) {
                    try {
                        q = p.clone().attr({
                            type: "text"
                        })
                    } catch (n) {
                        q = $("<input>").attr($.extend(g(this), {
                            type: "text"
                        }))
                    }
                    q.removeAttr("name").data({
                        "placeholder-password": true,
                        "placeholder-id": o
                    }).bind("focus.placeholder", b);
                    p.data({
                        "placeholder-textinput": q,
                        "placeholder-id": o
                    }).before(q)
                }
                p = p.removeAttr("id").hide().prev().attr("id", o).show()
            }
            p.addClass("placeholder");
            p[0].value = p.attr("placeholder")
        } else p.removeClass("placeholder")
    }
})(this, document, jQuery);
(function($) {
    $.extend({
        selso: {
            defaults: {
                type: "alpha",
                orderBy: "span.value",
                direction: "asc"
            },
            extractVal: function(type, text) {
                if (type == "num") return 1 * text;
                return text
            },
            accentsTidy: function(s) {
                var r = s.toLowerCase();
                r = r.replace(new RegExp(/\s/g), "");
                r = r.replace(new RegExp(/[\u00e0\u00e1\u00e2\u00e3\u00e4\u00e5]/g), "a");
                r = r.replace(new RegExp(/\u00e6/g), "ae");
                r = r.replace(new RegExp(/\u00e7/g), "c");
                r = r.replace(new RegExp(/[\u00e8\u00e9\u00ea\u00eb]/g), "e");
                r = r.replace(new RegExp(/[\u00ec\u00ed\u00ee\u00ef]/g),
                    "i");
                r = r.replace(new RegExp(/\u00f1/g), "n");
                r = r.replace(new RegExp(/[\u00f2\u00f3\u00f4\u00f5\u00f6]/g), "o");
                r = r.replace(new RegExp(/\u0153/g), "oe");
                r = r.replace(new RegExp(/[\u00f9\u00fa\u00fb\u00fc]/g), "u");
                r = r.replace(new RegExp(/[\u00fd\u00ff]/g), "y");
                r = r.replace(new RegExp(/\W/g), "");
                return r
            },
            orderAlpha: function(a, b) {
                var l = Math.min(a.length, b.length);
                for (var i = 0; i < l; i++)
                    if (a.charAt(i) < b.charAt(i)) return -1;
                    else if (a.charAt(i) > b.charAt(i)) return 1;
                if (a.length > b.length) return 1;
                if (a.length < b.length) return -1;
                return 0
            },
            alphaGreaterThan: function(s1, s2) {
                return this.orderAlpha(s1, s2)
            },
            stablesort: function(a, of) {
                var r = a;
                var s;
                for (var i = 1; i < r.length; i++) {
                    var j = 1;
                    while (i >= j && of(r[i - j], r[i]) > 0) j++;
                    if (j > 0) {
                        s = r.slice(0, i - j + 1);
                        s.push(r[i]);
                        s = s.concat(r.slice(i - j + 1, i));
                        if (i < r.length - 1) s = s.concat(r.slice(i + 1));
                        r = s
                    }
                }
                return r
            }
        }
    });
    $.fn.extend({
        outhtml: function() {
            if (this.length) return $("<div>").append($(this[0]).clone()).html();
            return null
        },
        prependToParent: function() {
            return this.each(function() {
                $(this).parent().prepend($(this).remove())
            })
        },
        selso: function(settings) {
            var tt = settings.type || $.selso.defaults.type;
            var to = settings.orderBy || $.selso.defaults.orderBy;
            var td = settings.direction || $.selso.defaults.direction;
            var te = settings.extract;
            var of = settings.orderFn;
            if (!$.isFunction(te)) te = function(obj) {
                return $.selso.extractVal(tt, $(to, obj).text())
            };
            var arr = [];
            this.each(function() {
                arr.unshift({
                    id: this.id,
                    val: te(this)
                })
            });
            if ($.isFunction(of));
            else if (tt == "num") of = function(a, b) {
                return a.val - b.val
            };
            else {
                if (tt == "accents") $.map(arr, function(n) {
                    n.val =
                        $.selso.accentsTidy(n.val)
                });
                of = function(a, b) {
                    return $.selso.alphaGreaterThan(a.val, b.val)
                }
            }
            var off = of;
            if (td == "asc") off = function(a, b) {
                return -1 * of(a, b)
            };
            arr = $.selso.stablesort(arr, off);
            for (var i = 0; i < arr.length; i++) $("#" + arr[i].id).prependToParent();
            return this
        }
    })
})(jQuery);
(function($) {
    if ($.browser.mozilla) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    "MozUserSelect": "none"
                })
            })
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).css({
                    "MozUserSelect": ""
                })
            })
        }
    } else if ($.browser.msie) {
        $.fn.disableTextSelect = function() {
            return this.each(function() {
                $(this).bind("selectstart.disableTextSelect", function() {
                    return false
                })
            })
        };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind("selectstart.disableTextSelect")
            })
        }
    } else {
        $.fn.disableTextSelect =
            function() {
                return this.each(function() {
                    $(this).bind("mousedown.disableTextSelect", function() {
                        return false
                    })
                })
            };
        $.fn.enableTextSelect = function() {
            return this.each(function() {
                $(this).unbind("mousedown.disableTextSelect")
            })
        }
    }
})(jQuery);
(function($) {
    jQuery.fn.supercomboselect = function(settings) {
        settings = jQuery.extend({
            addButton: " &rarr; ",
            removeButton: " &larr; ",
            optionsIdPrefix: "auto",
            wrapperId: "auto",
            selectedClass: "selected",
            isSortable: false,
            isSearchable: "auto",
            searchableAutoLimit: 10,
            autoSort: true,
            valuesEmptyString: "There are no more values to select",
            selectedEmptyString: "Select from the values on the left",
            defaultSearchBoxString: "Filter your search",
            minNumOfSearchChars: 3,
            selectedOrdering: []
        }, settings);
        this.each(function(i) {
            var _this =
                this;
            var selectID = this.id;
            var leftID = selectID + "_left";
            var rightID = selectID + "_right";
            var isShiftDown = false;
            var isCtrlDown = false;
            var lastSelected = null;
            var theForm = $(this).parents("form");
            var combo = "";
            var refs;
            var searchBox = null;
            if (!settings.optionsIdPrefix || settings.optionsIdPrefix == "auto" || settings.optionsIdPrefix.length === 0) settings.optionsIdPrefix = selectID + "_";
            if (!settings.wrapperId || settings.wrapperId == "auto" || settings.optionsIdPrefix.length === 0) settings.wrapperId = selectID + "_wrapper";
            if (settings.isSearchable ==
                "auto")
                if ($("#" + selectID).find("option").length >= settings.searchableAutoLimit) settings.isSearchable = true;
                else settings.isSearchable = false;
            var customSelectedSorting = settings.isSortable && settings.selectedOrdering;
            $("#" + settings.wrapperId).remove();
            combo += '<div id="' + settings.wrapperId + '" class="supercomboselect_wrapper col-xs-12">';
            combo += '<div class="supercomboselect_left col-xs-12 col-sm-5 panel panel-default">';
            combo += '<div class="supercomboselect panel-body">';
            combo += '<div class="supercomboselect_empty_msg supercomboselect_left_empty_msg text-muted">' + settings.valuesEmptyString +
                "</div>";
            combo += '<ul id="' + leftID + '" class="supercomboselect_list list-group">';
            combo += "</ul>";
            combo += "</div>";
            combo += "</div>";
            combo += '<div class="supercomboselect_btns col-xs-1">';
            combo += '<input type="button" class="csadd btn btn-success" value="' + settings.addButton + '" />';
            combo += '<input type="button" class="csremove btn btn-warning" value="' + settings.removeButton + '" />';
            combo += "</div>";
            combo += '<div class="supercomboselect_right col-xs-12 col-sm-5 panel panel-default">';
            combo += '<div class="supercomboselect panel-body">';
            combo += '<div class="supercomboselect_empty_msg supercomboselect_right_empty_msg text-muted">' +
                settings.selectedEmptyString + "</div>";
            combo += '<ul id="' + rightID + '" class="supercomboselect_list list-group">';
            combo += "</ul>";
            combo += "</div>";
            combo += '<div style="clear: both; height: 0px; line-height: 0px; font-size: 0px;"></div>';
            combo += "</div>";
            combo += "</div>";
            $(this).hide().after(combo);
            $("#" + leftID + " li").die();
            $("#" + rightID + " li").die();
            $(document).on("dblclick", "#" + leftID + ' li[class!="option_disabled"]', function(e) {
                addSelectedToRight()
            });
            $(document).on("dblclick", "#" + rightID + " li", function(e) {
                removeSelectedFromRight()
            });
            $(document).on("click", "#" + leftID + " li", function(e) {
                if ($(this).hasClass("optgrp") === false)
                    if (isCtrlDown) $(this).removeClass(settings.selectedClass);
                    else markForMove(this, leftID)
            });
            $(document).on("click", "#" + rightID + " li", function(e) {
                if (isCtrlDown) $(this).removeClass(settings.selectedClass);
                else markForMove(this, rightID)
            });
            $(document).on("keydown", function(e) {
                if (e.shiftKey) isShiftDown = true;
                else if (e.metaKey || e.ctrlKey) isCtrlDown = true;
                else if (e.keyCode == 38) {
                    if (lastSelected) markForMove($(lastSelected).prev())
                } else if (e.keyCode ==
                    40)
                    if (lastSelected) markForMove($(lastSelected).next())
            });
            $(document).on("keyup", function(e) {
                isShiftDown = false;
                isCtrlDown = false
            });
            $("#" + settings.wrapperId + " .csadd").click(function() {
                addSelectedToRight()
            });
            $("#" + settings.wrapperId + " .csremove").click(function() {
                removeSelectedFromRight()
            });
            $("#" + settings.wrapperId + " .supercomboselect_left_empty_msg, #" + settings.wrapperId + " .supercomboselect_right_empty_msg").hide();
            if (settings.isSortable) $("#" + rightID).sortable();
            if (settings.isSortable) theForm.submit(function() {
                onFormSubmit();
                return true
            });
            theForm.bind("form-pre-serialize", function() {
                onFormSubmit()
            });
            if (settings.isSearchable) {
                var prevSearchText = "";
                var nonSearchableChars = [13, 37, 38, 39, 40, 18, 17];
                var searchBoxHTML = '<div class="supercomboselect_search">';
                searchBoxHTML += '<input type="text" value="" name="supercomboselect_search" class="supercomboselect_search_text" /> <a href="#" class="supercomboselect_search_clear" style="display: none;">Clear Filter</a>';
                searchBoxHTML += "</div>";
                $("#" + leftID).parent().after(searchBoxHTML);
                searchBox = $("#" + leftID).parent().parent().find(".supercomboselect_search_text");
                searchBox.attr("placeholder", settings.defaultSearchBoxString).keyup(function(e) {
                    isShiftDown = false;
                    isCtrlDown = false;
                    if (e.shiftKey || e.metaKey || e.altKey || e.ctrlKey || $.inArray(e.keyCode, nonSearchableChars) != -1) return false;
                    var searchTerm = searchBox.val(),
                        $searchClear = searchBox.siblings(".supercomboselect_search_clear");
                    $searchClear.hide();
                    if (searchTerm.length) $searchClear.show();
                    if (searchTerm.length >= settings.minNumOfSearchChars ||
                        searchTerm.length === 0) {
                        if (searchTerm.substr(0, prevSearchText.length) != prevSearchText || searchTerm.length === 0) refreshLists();
                        var val = $(this).val().toLowerCase();
                        if (val.length) {
                            var filtered = $("#" + leftID + " li:not(.optgrp)").filter(function() {
                                var text = $(this).data("label");
                                if (!text) return false;
                                var index = text.toLowerCase().indexOf(val);
                                if (index == -1) return false;
                                else {
                                    var highlightedText = "";
                                    highlightedText += text.substr(0, index);
                                    highlightedText += '<span class="supercomboselect_search_highlight">' + text.substr(index,
                                        val.length) + "</span>";
                                    highlightedText += text.substr(index + val.length);
                                    $(this).html(highlightedText);
                                    return true
                                }
                            });
                            $("#" + leftID).empty().append(filtered)
                        }
                    } else if (searchTerm.length == settings.minNumOfSearchChars - 1 && searchTerm.substr(0, prevSearchText.length) != prevSearchText && searchTerm.length !== 0) refreshLists();
                    prevSearchText = searchTerm;
                    return false
                }).keydown(function(e) {
                    if (e.keyCode == 13) {
                        $(e.currentTarget).blur();
                        return false
                    }
                });
                searchBox.siblings(".supercomboselect_search_clear").click(function(e) {
                    e.preventDefault();
                    refreshLists();
                    searchBox.val("");
                    $(this).hide()
                })
            }

            function refreshLists(init) {
                var leftOpts = [];
                var rightOpts = [];
                refs = [];
                var idNum = 0;
                var maxSelected = typeof settings.selectedOrdering == "boolean" ? 0 : settings.selectedOrdering.length;
                var flippedSelectedOrder = {};
                if (customSelectedSorting && typeof settings.selectedOrdering == "object")
                    for (var n in settings.selectedOrdering) flippedSelectedOrder[settings.selectedOrdering[n]] = n;
                var $select = $("#" + selectID),
                    $optgroup = $select.find("optgroup");
                $select.find("option").each(function(i) {
                    var text =
                        $(this).text(),
                        value = $(this).attr("value"),
                        id = settings.optionsIdPrefix + idNum,
                        opt = "",
                        $opt = $("<li/>");
                    $opt.text(text);
                    $opt.attr("id", id);
                    //$opt.attr("class", "list-group-item");
                    $opt.attr("data-label", text);
                    if ($(this).is(":disabled")) $opt.addClass("option_disabled");
                    if (customSelectedSorting) {
                        var optSpanVal = flippedSelectedOrder[value] ? flippedSelectedOrder[value] : maxSelected;
                        $opt.append("<span/>");
                        $opt.find("span").attr("id", id + "_val").text(optSpanVal).hide()
                    }
                    opt = $opt[0].outerHTML;
                    if (!$(this).is("[selected]") && $(this).parent().is("optgroup") &&
                        $(this).parent().find("option:not([selected])")[0] === $(this)[0]) opt = '<li class="optgrp">' + $(this).parent().attr("label") + "</li>" + opt;
                    if ($(this).attr("selected")) rightOpts.push(opt);
                    else leftOpts.push(opt);
                    refs[idNum] = this;
                    idNum++
                });
                leftOpts = leftOpts.join("\n");
                rightOpts = rightOpts.join("\n");
                theForm.find("#" + leftID).empty().append(leftOpts);
                if (!customSelectedSorting || init) theForm.find("#" + rightID).empty().append(rightOpts);
                $("#" + settings.wrapperId + " .supercomboselect_left_empty_msg").hide();
                $("#" +
                    settings.wrapperId + " .supercomboselect_right_empty_msg").hide();
                if (!$("#" + leftID).children().length) $("#" + settings.wrapperId + " .supercomboselect_left_empty_msg").show();
                if (!$("#" + rightID).children().length) $("#" + settings.wrapperId + " .supercomboselect_right_empty_msg").show();
                isShiftDown = false;
                isCtrlDown = false;
                $(".supercomboselect").css({
                    overflowY: "hidden"
                }).css({
                    overflowY: "auto"
                }).disableTextSelect();
                $("#form").trigger("supercombo_list_refreshed");
                autoSort()
            }

            function addSelectedToRight() {
                $selectedOpts =
                    $("#" + leftID + " li[class=" + settings.selectedClass + "]");
                var selected = [];
                $selectedOpts.each(function(i) {
                    if (customSelectedSorting) theForm.find("#" + rightID).append($(this).removeClass(settings.selectedClass).html($(this).html()));
                    var opt = $(getOptionSourceRef(getIdNum(this)));
                    opt.attr("selected", "selected");
                    selected.push(opt.attr("value"))
                });
                $(_this).trigger("selectionAdded", [selected]);
                if (searchBox && searchBox.val().length) {
                    searchBox.val("");
                    searchBox.focus()
                }
                refreshLists()
            }

            function removeSelectedFromRight() {
                $selectedOpts =
                    $("#" + rightID + " li[class=" + settings.selectedClass + "]");
                var selected = [];
                $selectedOpts.each(function(i) {
                    if (customSelectedSorting) $(this).remove();
                    var opt = $(getOptionSourceRef(getIdNum(this)));
                    opt.removeAttr("selected", "selected");
                    selected.push(opt.attr("value"))
                });
                $(_this).trigger("selectionRemoved", [selected]);
                refreshLists()
            }

            function markForMove(selector) {
                if (isShiftDown && lastSelected) {
                    var lis = $(selector).parents("ul").find("li");
                    var num1 = lis.index($(selector));
                    var num2 = lis.index($(lastSelected));
                    if (num1 <
                        num2) {
                        startNum = num1;
                        endNum = num2
                    } else {
                        startNum = num2;
                        endNum = num1
                    }
                    if (startNum > -1) lis.slice(startNum, endNum + 1).addClass(settings.selectedClass)
                } else {
                    $(selector).addClass(settings.selectedClass);
                    lastSelected = selector
                }
                if (searchBox) searchBox.blur()
            }

            function getOptionSourceRef(idNum) {
                return refs[idNum]
            }

            function getIdNum(selector) {
                var id = $(selector).attr("id");
                var idNum = id ? parseInt(id.substr(settings.optionsIdPrefix.length), 10) : 0;
                return idNum
            }

            function autoSort() {
                if (settings.autoSort && !settings.isSortable) {
                    var beginIndex =
                        settings.optionsIdPrefix.length;
                    $("#" + rightID).find("li").selso({
                        type: "alpha",
                        extract: function(o) {
                            return $(o).text().toLowerCase()
                        }
                    })
                }
            }

            function onFormSubmit() {
                $("#" + rightID + " li").each(function(i) {
                    var src = $(getOptionSourceRef(getIdNum(this)));
                    $(this).prepend('<input type="hidden" name="' + $("#" + selectID).attr("name") + '" value="' + src.attr("value") + '"" class="sorted_val" />')
                });
                $("#" + selectID).remove()
            }
            refreshLists(true);
            if (customSelectedSorting) $("#" + rightID).find("li").selso({
                type: "num",
                orderBy: "span",
                direction: "asc"
            })
        });
        return this
    }
})(jQuery);
if (window.jQuery)(function($) {
    $.fn.MultiFile = function(options) {
        if (this.length == 0) return this;
        if (typeof arguments[0] == "string") {
            if (this.length > 1) {
                var args = arguments;
                return this.each(function() {
                    $.fn.MultiFile.apply($(this), args)
                })
            }
            $.fn.MultiFile[arguments[0]].apply(this, $.makeArray(arguments).slice(1) || []);
            return this
        }
        var options = $.extend({}, $.fn.MultiFile.options, options || {});
        $("form").not("MultiFile-intercepted").addClass("MultiFile-intercepted").submit($.fn.MultiFile.disableEmpty);
        if ($.fn.MultiFile.options.autoIntercept) {
            $.fn.MultiFile.intercept($.fn.MultiFile.options.autoIntercept);
            $.fn.MultiFile.options.autoIntercept = null
        }
        this.not(".MultiFile-applied").addClass("MultiFile-applied").each(function() {
            window.MultiFile = (window.MultiFile || 0) + 1;
            var group_count = window.MultiFile;
            var MultiFile = {
                e: this,
                E: $(this),
                clone: $(this).clone()
            };
            if (typeof options == "number") options = {
                max: options
            };
            var o = $.extend({}, $.fn.MultiFile.options, options || {}, ($.metadata ? MultiFile.E.metadata() : $.meta ? MultiFile.E.data() : null) || {}, {});
            if (!(o.max > 0)) {
                o.max = MultiFile.E.attr("maxlength");
                if (!(o.max > 0)) {
                    o.max = (String(MultiFile.e.className.match(/\b(max|limit)\-([0-9]+)\b/gi) || [""]).match(/[0-9]+/gi) || [""])[0];
                    if (!(o.max > 0)) o.max = -1;
                    else o.max = String(o.max).match(/[0-9]+/gi)[0]
                }
            }
            o.max = new Number(o.max);
            o.accept = o.accept || MultiFile.E.attr("accept") || "";
            if (!o.accept) {
                o.accept = MultiFile.e.className.match(/\b(accept\-[\w\|]+)\b/gi) || "";
                o.accept = (new String(o.accept)).replace(/^(accept|ext)\-/i, "")
            }
            $.extend(MultiFile, o || {});
            MultiFile.STRING = $.extend({}, $.fn.MultiFile.options.STRING, MultiFile.STRING);
            $.extend(MultiFile, {
                n: 0,
                slaves: [],
                files: [],
                instanceKey: MultiFile.e.id || "MultiFile" +
                    String(group_count),
                generateID: function(z) {
                    return MultiFile.instanceKey + (z > 0 ? "_F" + String(z) : "")
                },
                trigger: function(event, element) {
                    var handler = MultiFile[event],
                        value = $(element).attr("value");
                    if (handler) {
                        var returnValue = handler(element, value, MultiFile);
                        if (returnValue != null) return returnValue
                    }
                    return true
                }
            });
            if (String(MultiFile.accept).length > 1) {
                MultiFile.accept = MultiFile.accept.replace(/\W+/g, "|").replace(/^\W|\W$/g, "");
                MultiFile.rxAccept = new RegExp("\\.(" + (MultiFile.accept ? MultiFile.accept : "") + ")$",
                    "gi")
            }
            MultiFile.wrapID = MultiFile.instanceKey + "_wrap";
            MultiFile.E.wrap('<div class="MultiFile-wrap" id="' + MultiFile.wrapID + '"></div>');
            MultiFile.wrapper = $("#" + MultiFile.wrapID + "");
            MultiFile.e.name = MultiFile.e.name || "file" + group_count + "[]";
            if (!MultiFile.list) {
                MultiFile.wrapper.append('<div class="MultiFile-list" id="' + MultiFile.wrapID + '_list"></div>');
                MultiFile.list = $("#" + MultiFile.wrapID + "_list")
            }
            MultiFile.list = $(MultiFile.list);
            MultiFile.addSlave = function(slave, slave_count) {
                MultiFile.n++;
                slave.MultiFile =
                    MultiFile;
                if (slave_count > 0) slave.id = slave.name = "";
                if (slave_count > 0) slave.id = MultiFile.generateID(slave_count);
                slave.name = String(MultiFile.namePattern.replace(/\$name/gi, $(MultiFile.clone).attr("name")).replace(/\$id/gi, $(MultiFile.clone).attr("id")).replace(/\$g/gi, group_count).replace(/\$i/gi, slave_count));
                if (MultiFile.max > 0 && MultiFile.n - 1 > MultiFile.max) slave.disabled = true;
                MultiFile.current = MultiFile.slaves[slave_count] = slave;
                slave = $(slave);
                slave.val("").attr("value", "")[0].value = "";
                slave.addClass("MultiFile-applied");
                slave.change(function() {
                    $(this).blur();
                    if (!MultiFile.trigger("onFileSelect", this, MultiFile)) return false;
                    var ERROR = "",
                        v = String(this.value || "");
                    if (MultiFile.accept && v && !v.match(MultiFile.rxAccept)) ERROR = MultiFile.STRING.denied.replace("$ext", String(v.match(/\.\w{1,4}$/gi)));
                    for (var f in MultiFile.slaves)
                        if (MultiFile.slaves[f] && MultiFile.slaves[f] != this)
                            if (MultiFile.slaves[f].value == v) ERROR = MultiFile.STRING.duplicate.replace("$file", v.match(/[^\/\\]+$/gi));
                    var newEle = $(MultiFile.clone).clone();
                    newEle.addClass("MultiFile");
                    if (ERROR != "") {
                        MultiFile.error(ERROR);
                        MultiFile.n--;
                        MultiFile.addSlave(newEle[0], slave_count);
                        slave.parent().prepend(newEle);
                        slave.remove();
                        return false
                    }
                    $(this).css({
                        position: "absolute",
                        top: "-3000px"
                    });
                    slave.after(newEle);
                    MultiFile.addToList(this, slave_count);
                    MultiFile.addSlave(newEle[0], slave_count + 1);
                    if (!MultiFile.trigger("afterFileSelect", this, MultiFile)) return false
                });
                $(slave).data("MultiFile", MultiFile)
            };
            MultiFile.addToList = function(slave, slave_count) {
                if (!MultiFile.trigger("onFileAppend", slave,
                        MultiFile)) return false;
                var r = $('<div class="MultiFile-label"></div>'),
                    v = String(slave.value || ""),
                    a = $('<span class="MultiFile-title" title="' + MultiFile.STRING.selected.replace("$file", v) + '">' + MultiFile.STRING.file.replace("$file", v.match(/[^\/\\]+$/gi)[0]) + "</span>"),
                    b = $('<a class="MultiFile-remove" href="#' + MultiFile.wrapID + '">' + MultiFile.STRING.remove + "</a>");
                MultiFile.list.append(r.append(b, " ", a));
                b.click(function() {
                    if (!MultiFile.trigger("onFileRemove", slave, MultiFile)) return false;
                    MultiFile.n--;
                    MultiFile.current.disabled = false;
                    MultiFile.slaves[slave_count] = null;
                    $(slave).remove();
                    $(this).parent().remove();
                    $(MultiFile.current).css({
                        position: "",
                        top: ""
                    });
                    $(MultiFile.current).reset().val("").attr("value", "")[0].value = "";
                    if (!MultiFile.trigger("afterFileRemove", slave, MultiFile)) return false;
                    return false
                });
                if (!MultiFile.trigger("afterFileAppend", slave, MultiFile)) return false
            };
            if (!MultiFile.MultiFile) MultiFile.addSlave(MultiFile.e, 0);
            MultiFile.n++;
            MultiFile.E.data("MultiFile", MultiFile)
        })
    };
    $.extend($.fn.MultiFile, {
        reset: function() {
            var settings = $(this).data("MultiFile");
            if (settings) settings.list.find("a.MultiFile-remove").click();
            return $(this)
        },
        disableEmpty: function(klass) {
            klass = (typeof klass == "string" ? klass : "") || "mfD";
            var o = [];
            $("input:file.MultiFile").each(function() {
                if ($(this).val() == "") o[o.length] = this
            });
            return $(o).each(function() {
                this.disabled = true
            }).addClass(klass)
        },
        reEnableEmpty: function(klass) {
            klass = (typeof klass == "string" ? klass : "") || "mfD";
            return $("input:file." + klass).removeClass(klass).each(function() {
                this.disabled =
                    false
            })
        },
        intercepted: {},
        intercept: function(methods, context, args) {
            var method, value;
            args = args || [];
            if (args.constructor.toString().indexOf("Array") < 0) args = [args];
            if (typeof methods == "function") {
                $.fn.MultiFile.disableEmpty();
                value = methods.apply(context || window, args);
                setTimeout(function() {
                    $.fn.MultiFile.reEnableEmpty()
                }, 1E3);
                return value
            }
            if (methods.constructor.toString().indexOf("Array") < 0) methods = [methods];
            for (var i = 0; i < methods.length; i++) {
                method = methods[i] + "";
                if (method)(function(method) {
                    $.fn.MultiFile.intercepted[method] =
                        $.fn[method] || function() {};
                    $.fn[method] = function() {
                        $.fn.MultiFile.disableEmpty();
                        value = $.fn.MultiFile.intercepted[method].apply(this, arguments);
                        setTimeout(function() {
                            $.fn.MultiFile.reEnableEmpty()
                        }, 1E3);
                        return value
                    }
                })(method)
            }
        }
    });
    $.fn.MultiFile.options = {
        accept: "",
        max: -1,
        namePattern: "$name",
        STRING: {
            remove: "x",
            denied: "You cannot select a $ext file.\nTry again...",
            file: "$file",
            selected: "File selected: $file",
            duplicate: "This file has already been selected:\n$file"
        },
        autoIntercept: ["submit", "ajaxSubmit",
            "ajaxForm", "validate", "valid"
        ],
        error: function(s) {
            alert(s)
        }
    };
    $.fn.reset = function() {
        return this.each(function() {
            try {
                this.reset()
            } catch (e) {}
        })
    };
    $(function() {
        $("input[type=file].multi").MultiFile()
    })
})(jQuery);

function mirror(text) {
    return text
}

function url_title(text) {
    text = text.replace(/([^_-a-zA-Z0-9\s]|\,|\&)+/gi, "");
    text = text.replace(/\s+/gi, "-");
    text = text.toLowerCase();
    return text
}

function strtolower(text) {
    return text.toLowerCase()
}

function strtoupper(text) {
        return text.toUpperCase()
    }
    (function($) {
        $.fn.numeric = function(config, callback) {
            if (typeof config === "boolean") config = {
                decimal: config
            };
            config = config || {};
            if (typeof config.negative == "undefined") config.negative = true;
            var decimal = config.decimal === false ? "" : config.decimal || ".";
            var negative = config.negative === true ? true : false;
            var callback = typeof callback == "function" ? callback : function() {};
            return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur)
        };
        $.fn.numeric.keypress = function(e) {
            var decimal = $.data(this, "numeric.decimal");
            var negative = $.data(this, "numeric.negative");
            var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0;
            if (key == 13 && this.nodeName.toLowerCase() == "input") return true;
            else if (key == 13) return false;
            var allow = false;
            if (e.ctrlKey && key == 97 || e.ctrlKey && key == 65) return true;
            if (e.ctrlKey && key == 120 || e.ctrlKey && key == 88) return true;
            if (e.ctrlKey && key == 99 || e.ctrlKey && key == 67) return true;
            if (e.ctrlKey && key == 122 || e.ctrlKey && key == 90) return true;
            if (e.ctrlKey &&
                key == 118 || e.ctrlKey && key == 86 || e.shiftKey && key == 45) return true;
            if (key < 48 || key > 57) {
                if (this.value.indexOf("-") != 0 && negative && key == 45 && (this.value.length == 0 || $.fn.getSelectionStart(this) == 0)) return true;
                if (decimal && key == decimal.charCodeAt(0) && this.value.indexOf(decimal) != -1) allow = false;
                if (key != 8 && key != 9 && key != 13 && key != 35 && key != 36 && key != 37 && key != 39 && key != 46) allow = false;
                else if (typeof e.charCode != "undefined")
                    if (e.keyCode == e.which && e.which != 0) {
                        allow = true;
                        if (e.which == 46) allow = false
                    } else if (e.keyCode != 0 &&
                    e.charCode == 0 && e.which == 0) allow = true;
                if (decimal && key == decimal.charCodeAt(0))
                    if (this.value.indexOf(decimal) == -1) allow = true;
                    else allow = false
            } else allow = true;
            return allow
        };
        $.fn.numeric.keyup = function(e) {
            var val = this.value;
            if (val.length > 0) {
                var carat = $.fn.getSelectionStart(this);
                var decimal = $.data(this, "numeric.decimal");
                var negative = $.data(this, "numeric.negative");
                if (decimal != "") {
                    var dot = val.indexOf(decimal);
                    if (dot == 0) this.value = "0" + val;
                    if (dot == 1 && val.charAt(0) == "-") this.value = "-0" + val.substring(1);
                    val =
                        this.value
                }
                var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-", decimal];
                var length = val.length;
                for (var i = length - 1; i >= 0; i--) {
                    var ch = val.charAt(i);
                    if (i != 0 && ch == "-") val = val.substring(0, i) + val.substring(i + 1);
                    else if (i == 0 && !negative && ch == "-") val = val.substring(1);
                    var validChar = false;
                    for (var j = 0; j < validChars.length; j++)
                        if (ch == validChars[j]) {
                            validChar = true;
                            break
                        }
                    if (!validChar || ch == " ") val = val.substring(0, i) + val.substring(i + 1)
                }
                var firstDecimal = val.indexOf(decimal);
                if (firstDecimal > 0)
                    for (var i = length - 1; i > firstDecimal; i--) {
                        var ch =
                            val.charAt(i);
                        if (ch == decimal) val = val.substring(0, i) + val.substring(i + 1)
                    }
                this.value = val;
                $.fn.setSelection(this, carat)
            }
        };
        $.fn.numeric.blur = function() {
            var decimal = $.data(this, "numeric.decimal");
            var callback = $.data(this, "numeric.callback");
            var val = this.value;
            if (val != "") {
                var re = new RegExp("^\\d+$|\\d*" + decimal + "\\d+");
                if (!re.exec(val)) callback.apply(this)
            }
        };
        $.fn.removeNumeric = function() {
            return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).unbind("keypress",
                $.fn.numeric.keypress).unbind("blur", $.fn.numeric.blur)
        };
        $.fn.getSelectionStart = function(o) {
            try {
                if (o.createTextRange) {
                    var r = document.selection.createRange().duplicate();
                    r.moveEnd("character", o.value.length);
                    if (r.text == "") return o.value.length;
                    return o.value.lastIndexOf(r.text)
                } else return o.selectionStart
            } catch (e) {}
        };
        $.fn.setSelection = function(o, p) {
            if (typeof p == "number") p = [p, p];
            if (p && p.constructor == Array && p.length == 2)
                if (o.createTextRange) {
                    var r = o.createTextRange();
                    r.collapse(true);
                    r.moveStart("character",
                        p[0]);
                    r.moveEnd("character", p[1]);
                    r.select()
                } else if (o.setSelectionRange) {
                o.focus();
                o.setSelectionRange(p[0], p[1])
            }
        }
    })(jQuery);
(function($) {
    jQuery.fn.repeatable = function(o) {
        var options = $.extend({
            addButtonText: "Add Another",
            addButtonClass: "add_another",
            removeButtonClass: "remove",
            removeButtonText: "Remove",
            repeatableSelector: ".repeatable",
            repeatableParentSelector: ".repeatable_container",
            removeSelector: ".remove",
            contentSelector: ".repeatable_content",
            warnBeforeDelete: true,
            warnBeforeDeleteMessage: "Are you sure you want to delete this item?",
            addNewTitle: "New",
            sortableSelector: ".grabber",
            sortable: true,
            initDisplay: false,
            dblClickBehavior: "toggle",
            max: null,
            min: null,
            depth: 1,
            allowCollapsingContent: true,
            removeable: true
        }, o || {});
        var $checked = null;
        var parseTemplate = function(elem, i) {
            var $childTemplates = $(elem).find(options.repeatableSelector);
            var depth = $(elem).parent().attr("data-depth");
            var titleField = $(elem).parent().attr("data-title_field");
            var title = $(elem).find('input[name$="[' + titleField + ']"]').val();
            if (!depth) depth = 0;
            var depthSuffix = depth > 0 ? "_" + depth : "";
            $(".num" + depthSuffix, elem).html(i + 1);
            $(".index" + depthSuffix, elem).html(i);
            $(".title" + depthSuffix,
                elem).html(title);
            $(elem).find("label,input,textarea,select").addClass("field_depth_0");
            var parseAttribute = function(elem, attr) {
                var newId = $(elem).attr(attr);
                if (newId && newId.length) {
                    newId = newId.replace(/\{index\}/g, i);
                    newId = newId.replace(/([-_a-zA-Z0-9]+_)\d+(_[-_a-zA-Z0-9]+)$/, "$1" + i + "$2");
                    $(elem).attr(attr, newId)
                }
            };
            var $childRepeatables = $(elem).find(options.repeatableSelector);
            if (depth == 0 && $childTemplates.length) $childRepeatables.each(function(i) {
                $(this).find("input,textarea,select").each(function(j) {
                    $(this).removeClass("field_depth_0");
                    $(this).addClass("field_depth_1")
                })
            });
            $("label,.field_depth_" + depth, elem).each(function(j) {
                var newName = $(this).attr("name");
                if (newName && newName.length) {
                    newName = newName.replace(/([-_a-zA-Z0-9\[\]]+)\[\d+\]([-_a-zA-Z0-9\[\]]+)$/, "$1[" + i + "]$2");
                    newName = newName.replace(/([-_a-zA-Z0-9]+)_\d+_([-_a-zA-Z0-9]+)$/, "$1_" + i + "_$2");
                    newName = newName.replace("[", "[");
                    newName = newName.replace("]", "]");
                    $(this).attr("name", newName);
                    if ($checked) setTimeout(function() {
                            $checked.each(function() {
                                $(this).attr("checked", "checked")
                            })
                        },
                        0)
                }
                if ($(this).is("label")) parseAttribute(this, "for");
                else {
                    parseAttribute(this, "id");
                    $(this).attr("data-index", i)
                }
            });
            var $parentElem = $(elem).has(options.repeatableSelector + " " + options.repeatableSelector);
            var parentIndex = null;
            if ($parentElem.length > 0) parentIndex = $parentElem.attr("data-index");
            if (depth == 0 && $childTemplates.length) $childRepeatables.each(function(i) {
                $(this).find("input,textarea,select").each(function(j) {
                    var newName = $(this).attr("name");
                    if (newName && newName.length && parentIndex != null) {
                        newName =
                            newName.replace(/([-_a-zA-Z0-9]+\[)\d+(\]\[[-_a-zA-Z0-9]+\]\[[-_a-zA-Z0-9]+\])/g, "$1" + parentIndex + "$2");
                        newName = newName.replace(/([-_a-zA-Z0-9]+)_\d+_([-_a-zA-Z0-9]+_[-_a-zA-Z0-9]+)/g, "$1_" + parentIndex + "_$2");
                        newName = newName.replace("[", "[");
                        newName = newName.replace("]", "]");
                        $(this).attr("name", newName)
                    }
                    var newId = $(this).attr("id");
                    if (newId && newId.length && parentIndex != null) {
                        newId = newId.replace(/([-_a-zA-Z]+)_\d+_([-_a-zA-Z]+_[-_a-zA-Z0-9]+_[-_a-zA-Z])/g, "$1_" + parentIndex + "_$2");
                        $(this).attr("id", newId)
                    }
                })
            })
        };
        var createRemoveButton = function(elem) {
            if (!options.removeable) return;
            $elem = $(elem);
            $elem.children(options.removeSelector).remove();
            $elem.append('<a href="#" class="' + options.removeButtonClass + '">' + options.removeButtonText + " </a>");
            $(document).on("click", options.repeatableSelector + " ." + options.removeButtonClass, function(e) {
                var $this = $(this).closest(options.repeatableParentSelector);
                var max = $this.attr("data-max") ? parseInt($this.attr("data-max")) : null;
                var min = $this.attr("data-min") ? parseInt($this.attr("data-min")) :
                    null;
                if (options.warnBeforeDelete == false || confirm(options.warnBeforeDeleteMessage)) {
                    $(this).closest(options.repeatableSelector).remove();
                    var $children = $this.children(options.repeatableSelector);
                    if ($children.length < max) $this.next().show();
                    reOrder($this)
                }
                checkMin($this, min);
                $this.trigger("removed");
                e.stopImmediatePropagation();
                return false
            })
        };
        var reOrder = function($elem) {
            $checked = $('input[type="radio"]', $elem).filter(":checked");
            $elem.children(options.repeatableSelector).each(function(i) {
                $(this).attr("data-index",
                    i);
                parseTemplate(this, i)
            })
        };
        var checkMax = function($elem, max) {
            if (max && $elem.children(options.repeatableSelector).length != 0 && $elem.children(options.repeatableSelector).length >= max) $elem.next().hide();
            else $elem.next().show()
        };
        var checkMin = function($elem, min) {
            $children = $elem.children(options.repeatableSelector);
            min = parseInt(min);
            if (min && $children.length != 0 && $children.length <= min) $children.find("." + options.removeButtonClass + ":first").hide();
            else $children.find("." + options.removeButtonClass + ":first").show()
        };
        var cloneRepeatableNode = function($elem) {
            $clone = $elem.children(options.repeatableSelector + ":first").clone(false);
            return $clone
        };
        var createCollapsingContent = function($elem) {
            if (options.allowCollapsingContent) $($elem).find(options.sortableSelector).unbind("dblclick").dblclick(function(e) {
                $parent = $(this).closest(options.repeatableSelector).parent();
                var dblclick = $parent.attr("data-dblclick") ? $parent.attr("data-dblclick") : null;
                var $elems = $(this).closest(options.repeatableSelector).find(options.contentSelector +
                    ":first");
                if (dblclick == "accordion" || dblclick == "accordian") {
                    $parent.find(options.contentSelector).hide();
                    $elems.show()
                } else $elems.toggle()
            })
        };
        var createAddButton = function($elem) {
            $("." + options.addButtonClass).each(function(i) {
                var $prev = $(this).prev();
                var $clone = cloneRepeatableNode($prev);
                $(this).data("clone", $clone)
            })
        };
        $(document).on("click", "." + options.addButtonClass, function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var $prev = $(this).prev();
            var max = $prev.attr("data-max") ? parseInt($prev.attr("data-max")) :
                null;
            var min = $prev.attr("data-min") ? parseInt($prev.attr("data-min")) : null;
            var dblclick = $prev.attr("data-dblclick") ? $prev.attr("data-dblclick") : null;
            if (!$(e.currentTarget).data("clone")) {
                var $clone = cloneRepeatableNode($prev);
                $(e.currentTarget).data("clone", $clone)
            } else var $clone = $(e.currentTarget).data("clone");
            var $this = $(this).prev();
            var $clonecopy = $clone.clone(false);
            $clonecopy.addClass("noclone");
            $clonecopy.find(options.contentSelector + ":first").show();
            if (dblclick == "accordian" || dblclick == "accordion") $prev.find(options.contentSelector).hide();
            createCollapsingContent($clonecopy);
            var $children = $this.children(options.repeatableSelector);
            if (max && $children.length >= max) return false;
            var index = $children.length;
            parseTemplate($clonecopy, index);
            createRemoveButton($clonecopy);
            $this.append($clonecopy);
            $clonecopy.find("input,select,textarea").not('input[type="radio"], input[type="checkbox"], input[type="button"], .noclear').val("");
            $clonecopy.find('input[type="checkbox"]').not(".noclear").prop("checked", false);
            $clonecopy.find('input[type="radio"]').not(".noclear").each(function() {
                if (parseInt($(this).data("orig_checked")) ==
                    1) $(this).prop("checked", true);
                else $(this).prop("checked", false)
            });
            $clonecopy.find(".noclone").remove();
            reOrder($this);
            if (max && $children.length != 0 && $children.length >= max - 1) $(this).hide();
            checkMin($prev, min);
            $this.trigger({
                type: "cloned",
                clonedNode: $clonecopy
            })
        });
        var index = 0;
        return this.each(function() {
            var $this = $(this);
            var $repeatables = $this.children(options.repeatableSelector);
            if (!$this.is(".__applied__")) $repeatables.each(function(i) {
                parseTemplate(this, i);
                createRemoveButton(this)
            });
            $parent = $this.parent();
            if (options.max) $this.attr("data-max", options.max);
            if (options.min) $this.attr("data-min", options.min);
            if (options.dblClickBehavior) $this.attr("data-dblclick", options.dblClickBehavior);
            if (options.initDisplay && !$this.is(".__applied__")) {
                $this.attr("data-init_display", options.init_display);
                if ($repeatables.closest(options.contentSelector).length) $toDisplay = $repeatables.find(options.contentSelector);
                else $toDisplay = $repeatables.find(options.contentSelector).not(options.contentSelector + " " + options.contentSelector);
                if (options.initDisplay == "first") $toDisplay.not(":first").hide();
                else if (options.initDisplay == "none" || options.initDisplay == "closed") $toDisplay.hide()
            }
            if ($parent.find(options.addButtonClass).length == 0 && !$this.hasClass("__applied__")) $parent.append('<a href="#" class="' + options.addButtonClass + '">' + options.addButtonText + " </a>");
            if (options.sortable) $this.sortable({
                cursor: "move",
                handle: options.sortableSelector,
                start: function(event, ui) {
                    $this.trigger({
                        type: "sortStarted",
                        clonedNode: $this
                    })
                },
                stop: function(event,
                    ui) {
                    reOrder($(this));
                    $this.trigger({
                        type: "sortStopped",
                        clonedNode: $this
                    })
                }
            });
            if (!$this.hasClass("__applied__")) createAddButton($this);
            if ($this.attr("data-max")) checkMax($this, options.max);
            if ($this.attr("data-min")) checkMin($this, options.min);
            createCollapsingContent($this);
            index++;
            $this.addClass("__applied__");
            return this
        })
    }
})(jQuery);
(function($) {
    var pushStackOrig, pushStackChrome;
    pushStackOrig = $.fn.pushStack;
    pushStackChrome = function(elems, name, selector) {
        var ret = new jQuery.fn.init;
        if (jQuery.isArray(elems)) push.apply(ret, elems);
        else jQuery.merge(ret, elems);
        ret.prevObject = this;
        ret.context = this.context;
        if (name === "find") ret.selector = this.selector + (this.selector ? " " : "") + selector;
        else if (name) ret.selector = this.selector + "." + name + "(" + selector + ")";
        return ret
    };
    $.fn.pushStack = function(elems, name, selector) {
        var ret;
        try {
            ret = pushStackOrig.call(this,
                elems, name, selector);
            return ret
        } catch (e) {
            if (e instanceof TypeError)
                if (!(ret instanceof jQuery.fn.init)) {
                    ret = pushStackChrome.call(this, elems, name, selector);
                    return ret
                }
            throw e;
        }
    }
}).call(this, jQuery);
jQuery.fn.exists = function() {
    return this.size() > 0
};
jQuery.fn.setClass = function(cssClass) {
    var j = jQuery(this).attr("className", cssClass);
    return j
};
jQuery.fn.isHidden = function() {
    if (jQuery(this).css("display") == "none") return true;
    return false
};
jQuery.include = function(file, type) {
    if (!type) type = "script";
    $.ajax({
        async: false,
        url: file,
        dataType: type,
        error: function() {
            var msg = new jqx.lib.Message("There was an error in loading the file" + file, "error");
            msg.display()
        }
    })
};

function initFuelNamespace() {
    var f;
    if (window.fuel == undefined)
        if (top.window.fuel != undefined) f = top.window.fuel;
        else f = {};
    else f = window.fuel;
    return f
}
if (typeof window.fuel == "undefined") window.fuel = {};
fuel.lang = function(key) {
    return __FUEL_LOCALIZED__[key]
};
fuel.getFieldId = function(field, context) {
    if (window.__FUEL_INLINE_EDITING != undefined) {
        var val = $(".__fuel_module__", context).attr("id");
        var prefix = val.split("--")[0];
        return prefix + "--" + field
    } else return field
};
fuel.getModule = function(context) {
    if (window.__FUEL_INLINE_EDITING != undefined) return $(".__fuel_module__", context).val();
    else return page.module
};
fuel.modalWindow = function(html, cssClass, autoResize, onLoadCallback, onCloseCallback) {
    console.log(html);
    var modalId = "__FUEL_modal__";
    if (!cssClass) cssClass = "";
    var $context = $("body", window.document);
    //if (!$("#" + modalId, $context).length) var modalHTML = '<div id="' + modalId + '"><div class="loader"></div><a href="#" class="modal_close jqmClose"></a><div class="modal_content"></div></div>';
    if (!$("#" + modalId, $context).length) {
        //var modalHTML = '<div id="' + modalId + '"><div class="loader"></div><a href="#" class="modal_close jqmClose"></a><div class="modal_content"></div></div>';    
        var modalHTML = '<div id="' + modalId + '" class="modal fade" aria-labelledby="'+modalId+'_label" aria-hidden="true" role="dialog"><div class="modal-dialog"><div class="modal-content">'
                +'<div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
                +'<h4 class="modal-title" id="'+modalId+'_label">Modal</h4></div>'
                +'<div class="modal-body"></div>' //<div class="modal-footer"></div>
                +'</div></div></div>';
    }
    /*else { 
        console.log('ELSE');
        $("#" + modalId, $context).html('<div class="modal-content"></div>'); 
    }*/
    /*var modalOnHide = function() {
        $("#" + modalId, $context).hide();
        //$(".jqmOverlay", $context).remove();
        if (onCloseCallback) onCloseCallback()
    };*/
    $context.append(modalHTML);
    $modal = $("#" + modalId, $context);
    //$modal.attr("class", "__fuel__ __fuel_modal__ jqmWindow " + cssClass);
    $modal.attr("class", "modal fade __fuel__ __fuel_modal__ " + cssClass);
    //var modalWidth = $modal.outerWidth();
    //var centerWidth = -(modalWidth / 2);
    //$modal.css("marginLeft", centerWidth + "px");
    /*var jqmOpts = {
        onHide: modalOnHide,
        toTop: true
    };*/
    //if (onLoadCallback) jqmOpts.onLoad = onLoadCallback;
    //$modal.jqm(jqmOpts).jqmShow();
    
    // Show Twitter Bootstrap modal
    $('#__FUEL_modal__').modal('show');
    
    //$modal.find(".modal_content").empty().append(html);
    $modal.find(".modal-body").html(html);
    $modal.find("iframe").load(function() {
        //$(".jqmWindow .loader", $context).hide();
        var iframe = this;
        var contentDoc = iframe.contentDocument;
        /*$(".cancel", contentDoc).add(".modal_close").click(function(e) {
            e.preventDefault();
            //$modal.jqmHide()
        });*/
        console.log('autoresize: '+autoResize);
        if (autoResize) {
            docHeight = fuel.calcHeight(contentDoc);
            $(iframe).height(docHeight);
            $(iframe).width('100%');
        }

        /*if (autoResize) setTimeout(function() {
            docHeight = fuel.calcHeight(contentDoc);
            $(iframe.contentWindow.parent.document).find("#" + modalId + "iframe").height(docHeight);
            fuel.cascadeIframeWindowSize(docHeight);
            $(iframe).height(docHeight)
        }, 250)*/
        
    });
    return $modal
};
fuel.closeModal = function() {
    var modalId = "__FUEL_modal__";
    // Hide Twitter Bootstrap modal
    $("#" + modalId).modal('hide');
    //$("#" + modalId).jqmHide()
};
fuel.getModule = function(context) {
    if (window.fuel && window.fuel.module) return window.fuel.module;
    if (context == undefined) context = null;
    var module = $(".__fuel_module__", context).length ? $(".__fuel_module__", context).val() : null;
    return module
};
fuel.getModuleURI = function(context) {
    if (context == undefined) context = null;
    var module = $(".__fuel_module_uri__").length ? $(".__fuel_module_uri__").val() : null;
    return module
};
fuel.isTop = function() {
    return self == top
};
fuel.windowLevel = function() {
    var level = 0;
    var win = window;
    while (win != top && win.parent != null) {
        level++;
        win = win.parent
    }
    return level
};
fuel.calcHeight = function(context) {
    var height = 0;
    if ($("#login", context).length) var elems = "#login";
    else var elems = "#fuel_main_top_panel, #fuel_actions, #fuel_notification, #fuel_main_content_inner, #list_container, .instructions";
    $(elems, context).each(function(i) {
        var outerHeight = parseInt($(this).outerHeight(false));
        if (outerHeight) height += outerHeight
    });
    if (height > 480) height = 480;
    else height += 30;
    return height
};
fuel.adjustIframeWindowSize = function() {
    var iframe = $(".inline_iframe", top.window.document);
    if (iframe.length) {
        iframe = iframe[0];
        var contentDoc = iframe.contentDocument;
        var height = parseInt(fuel.calcHeight(contentDoc));
        var width = parseInt($("#fuel_main_content_inner .form", contentDoc).width()) + 50;
        $(iframe).height(height);
        $(iframe).width(width)
    }
};
fuel.cascadeIframeWindowSize = function(height) {
    var level = 0;
    if (height) height = height + 100;
    $(".inline_iframe", top.window.document).height(height)
};