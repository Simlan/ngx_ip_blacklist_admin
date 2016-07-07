/**
 * Created by sakura on 20/03/2016.
 */

/***
 * @public
 * @name: _SHOW_FORM_REMOTE
 * @note: Hiển thị form modal popup lấy template từ server về
 */

function _SHOW_FORM_REMOTE(remote_link, target, multiform) {
    if (target === undefined || target == '') {
        target = 'myModal';
    }
    if (multiform != undefined) {
        target = target + remote_link.replace(/[^\w\s]/gi, '');
    } else {
        jQuery('.modal-backdrop').remove();
    }
    jQuery('#' + target).remove();
    jQuery('body').append('<div class="modal fade" id="' + target + '" tabindex="-1" role="dialog" ' +
        'aria-labelledby="' + target + 'Label" aria-hidden="true">' +
        '<div class="mmbd"></div></div>');
    var modal = jQuery('#' + target), modalBody = jQuery('#' + target + ' .mmbd');
    modal.on('show.bs.modal', function () {
        modalBody.load(remote_link);
    }).modal({backdrop: 'static'});
    return false;
}

var STATUS_JSON_DONE = 1;
var STATUS_JSON_RELOGIN = -2;
var ALL_POST_RESULT = [];
/***
 *
 * @param url
 * @param data
 * @param callback
 * @param cache
 * @param type
 * @returns {*}
 * @public
 */
function _POST(url, data, callback, cache, type) {
    if (cache != undefined) {
        if (ALL_POST_RESULT[cache] != undefined) {
            return callback(ALL_POST_RESULT[cache])
        }
    }
    var _token = jQuery('meta[name=_token]').attr("content");
    if (_token) {
        var _data = {'name': '_token', 'value': _token};
        data.push(_data);
    }
    if (type == undefined) {
        type = 'json';
    }
    jQuery.ajax({
        url: url,
        type: "POST",
        data: data,
        dataType: type,
        success: function (data) {
            if (cache != undefined && cache != null) {
                ALL_POST_RESULT[cache] = data;
            }
            return eval(callback(data));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
    return true;
}
var App = {
    DOMAIN: document.location.origin,
    API: document.location.origin + '/api'
};
var MNG_SEO = {
    settings: {
        URL_ACTION: App.DOMAIN + '/admin/seo/'
    },
    MNG_LANDING_PAGE: {
        InputForm_show: function (id, page) {
            if (id === undefined) {
                id = 0;
            }
            var linkremoteform = MNG_SEO.settings.URL_ACTION + 'landing-page/' + page + '?id=' + id;
            return _SHOW_FORM_REMOTE(linkremoteform);
        },
        InputForm_save: function (formElementId) {
            var formdata = jQuery('#' + formElementId).serializeArray();
            var txtLink = jQuery('.txtLink').val();
            var callBack = function (json) {
                if (json.status == 0) {
                    if (json.msg) {
                        jQuery.each(json.msg, function (key, value) {
                            show_notify('Lỗi', 'warning', 'icon-warning2', value);
                        });
                    }
                } else {
                    show_notify(json.msg, 'success', 'icon-checkmark3', '');
                    if (json.id) {
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    } else {
                        if (!confirm('Ban có muốn tiếp tục thực hiện thao tác?')) {
                            window.location.reload();
                        } else {
                            jQuery('#' + formElementId)[0].reset();
                        }
                    }
                }
            };
            if (txtLink !== undefined && !isUrlValid(txtLink)) {
                if (!confirm('Link của bạn không đúng định dạng bạn vẫn muốn tiếp tục?')) {
                    return false;
                }
            }
            return _POST(MNG_SEO.settings.URL_ACTION + 'landing-page/save', formdata, callBack);
        },
        deleteHandle: function (formElementId) {
            var formdata = jQuery('#' + formElementId).serializeArray();
            var callBack = function (json) {
                if (json.status == 1) {
                    alert(json.msg);
                    window.location.reload();
                } else {
                    alert(json.msg);
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'landing-page/deleteHandle', formdata, callBack);
        },
        multiRemove: function (flag) {
            var ids = getCheckBoxVal('landingPageTbl', 'landingPageCbx');
            if (ids == '') {
                alert('Bạn chưa chọn landing page nào!');
                return false;
            }
            var msg = "Bạn có chắc chắn muốn xóa";
            if (flag) {
                msg += " hoàn toàn (dữ liệu sẽ không thể khôi phục)"
            }
            if (!confirm(msg + ' ?')) {
                return false;
            }
            var data = [{'name': 'ids', 'value': ids}, {'name': 'flag', 'value': flag}];
            var callBack = function (json) {
                if (json.status == 1) {
                    alert(json.msg);
                    window.location.reload();
                } else {
                    alert(json.msg);
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'landing-page/multiRemove', data, callBack);
        }
    },
    MNG_DOMAIN: {
        InputForm_show: function (id, page) {
            if (id === undefined) {
                id = 0;
            }
            var linkremoteform = MNG_SEO.settings.URL_ACTION + 'domain/' + page + '?id=' + id;
            return _SHOW_FORM_REMOTE(linkremoteform);
        },
        InputForm_save: function (formElementId) {
            var formdata = jQuery('#' + formElementId).serializeArray();
            var txtLink = jQuery('.txtLink').val();
            var callBack = function (json) {
                if (json.status == 0) {
                    if (json.msg) {
                        var first = true;
                        jQuery.each(json.msg, function (key, value) {
                            show_notify('Lỗi', 'warning', 'icon-warning2', value);
                            if (first) {
                                validateInput(key, true);
                            } else {
                                validateInput(key, false);
                            }
                        });
                    }
                } else {
                    if (json.msg) {
                        show_notify(json.msg, 'success', 'icon-checkmark3', '');
                        if (json.id) {
                            setTimeout(function () {
                                window.location.reload();
                            }, 1000);
                        } else {
                            if (!confirm('Ban có muốn tiếp tục thực hiện thao tác?')) {
                                window.location.reload();
                            } else {
                                jQuery('#' + formElementId)[0].reset();
                            }
                        }
                    }
                }
            };
            if (txtLink !== undefined && !isUrlValid(txtLink) && txtLink != '') {
                if (!confirm('Link của bạn không đúng định dạng bạn vẫn muốn tiếp tục?')) {
                    return false;
                }
            }
            return _POST(MNG_SEO.settings.URL_ACTION + 'domain/save', formdata, callBack);
        },
        deleteHandle: function (formElementId) {
            var formdata = jQuery('#' + formElementId).serializeArray();
            var callBack = function (json) {
                if (json.status == 1) {
                    alert(json.msg);
                    window.location.reload();
                } else {
                    alert(json.msg);
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'domain/deleteHandle', formdata, callBack);
        },
        //deleteConfirm : function (table) {
        //    var ids = getCheckBoxVal(table, 'domainCbx');
        //    if (ids == '') {
        //        alert('Bạn chưa chọn domain nào!');
        //        return false;
        //    }
        //    var linkremoteform = MNG_SEO.settings.URL_ACTION + 'domain/deleteConfirm';
        //    return _SHOW_FORM_REMOTE(linkremoteform);
        //},
        multiRemove: function (flag) {
            var ids = getCheckBoxVal('domainTbl', 'domainCbx');
            if (ids == '') {
                alert('Bạn chưa chọn domain nào!');
                return false;
            }
            var msg = "Bạn có chắc chắn muốn xóa";
            if (flag) {
                msg += " hoàn toàn (dữ liệu sẽ không thể khôi phục)"
            }
            if (!confirm(msg + ' ?')) {
                return false;
            }
            var data = [{'name': 'ids', 'value': ids}, {'name': 'flag', 'value': flag}];
            var callBack = function (json) {
                if (json.status == 1) {
                    alert(json.msg);
                    window.location.reload();
                } else {
                    alert(json.msg);
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'domain/multiRemove', data, callBack);
        }
    },

    MNG_BACKLINK: {
        InputForm_show: function (id) {
            if (id === undefined) {
                id = 0;
            }
            var linkremoteform = MNG_SEO.settings.URL_ACTION + 'backlink/input?id=' + id;
            return _SHOW_FORM_REMOTE(linkremoteform);
        },
        DeleteForm_show: function (id) {
            if (id !== undefined && id > 0) {
                var linkremoteform = MNG_SEO.settings.URL_ACTION + 'backlink/show?id=' + id;
                return _SHOW_FORM_REMOTE(linkremoteform);
            }
        },
        InputForm_save: function (formElementId) {
            jQuery('#btn-submit').attr('disabled', true);
            var formdata = jQuery(formElementId).serializeArray();
            var callBack = function (json) {
                jQuery('#btn-submit').attr('disabled', false);
                if (json.status == 1) {
                    jQuery.each(json.msg, function (k, v) {
                        show_notify('Lỗi', 'warning', 'icon-warning2', v);
                    });
                } else {
                    show_notify('Đã lưu', 'success', 'icon-checkmark3', '');
                    if (confirm(json.msg)) {
                        window.location.reload();
                    }
                    if (json.data.id == 0) {
                        jQuery(formElementId)[0].reset();
                    }
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'backlink/save', formdata, callBack);
        },
        DeleteForm_save: function (formElementId) {
            jQuery('#btn-submit').attr('disabled', true);
            var formdata = jQuery(formElementId).serializeArray();
            var callBack = function (json) {
                jQuery('#btn-submit').attr('disabled', false);
                if (json.status == 1) {
                    jQuery.each(json.msg, function (k, v) {
                        show_notify('Lỗi', 'warning', 'icon-warning2', v);
                    });
                } else {
                    show_notify('Đã xóa', 'success', 'icon-checkmark3', '');
                    window.location.reload();
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'backlink/delete', formdata, callBack);
        },
        multiRemove: function (flag) {
            var ids = getCheckBoxVal('backLinkTbl', 'backLinkCbx');
            if (ids == '') {
                alert('Bạn chưa chọn back link nào!');
                return false;
            }
            var msg = "Bạn có chắc chắn muốn xóa";
            if (flag) {
                msg += " hoàn toàn (dữ liệu sẽ không thể khôi phục)"
            }
            if (!confirm(msg + ' ?')) {
                return false;
            }
            var data = [{'name': 'ids', 'value': ids}, {'name': 'flag', 'value': flag}];
            var callBack = function (json) {
                if (json.status == 1) {
                    alert(json.msg);
                    window.location.reload();
                } else {
                    alert(json.msg);
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'backlink/multiRemove', data, callBack);
        }
    },

    MNG_KEYWORD: {
        InputForm_show: function (id) {
            if (id === undefined) {
                id = 0;
            }
            var linkremoteform = MNG_SEO.settings.URL_ACTION + 'keyword/input?id=' + id;
            return _SHOW_FORM_REMOTE(linkremoteform);
        },
        DeleteForm_show: function (id) {
            if (id !== undefined && id > 0) {
                var linkremoteform = MNG_SEO.settings.URL_ACTION + 'keyword/show?id=' + id;
                return _SHOW_FORM_REMOTE(linkremoteform);
            }
        },
        InputForm_save: function (formElementId) {
            jQuery('#btn-submit').attr('disabled', true);
            var formdata = jQuery(formElementId).serializeArray();
            var callBack = function (json) {
                jQuery('#btn-submit').attr('disabled', false);
                if (json.status == 1) {
                    jQuery.each(json.msg, function (k, v) {
                        show_notify('Lỗi', 'warning', 'icon-warning2', v);
                    });
                } else {
                    show_notify('Đã lưu', 'success', 'icon-checkmark3', '');
                    if (confirm(json.msg)) {
                        window.location.reload();
                    }
                    if (json.data.id == 0) {
                        jQuery(formElementId)[0].reset();
                    }
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'keyword/save', formdata, callBack);
        },
        DeleteForm_save: function (formElementId) {
            jQuery('#btn-submit').attr('disabled', true);
            var formdata = jQuery(formElementId).serializeArray();
            var callBack = function (json) {
                jQuery('#btn-submit').attr('disabled', false);
                if (json.status == 1) {
                    jQuery.each(json.msg, function (k, v) {
                        show_notify('Lỗi', 'warning', 'icon-warning2', v);
                    });
                } else {
                    show_notify('Xóa thành công', 'success', 'icon-checkmark3', '');
                    window.location.reload();
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'keyword/delete', formdata, callBack);
        },
        multiRemove: function (flag) {
            var ids = getCheckBoxVal('keywordTbl', 'keywordCbx');
            if (ids == '') {
                alert('Bạn chưa chọn từ khóa nào!');
                return false;
            }
            var msg = "Bạn có chắc chắn muốn xóa";
            if (flag) {
                msg += " hoàn toàn (dữ liệu sẽ không thể khôi phục)"
            }
            if (!confirm(msg + ' ?')) {
                return false;
            }
            var data = [{'name': 'ids', 'value': ids}, {'name': 'flag', 'value': flag}];
            var callBack = function (json) {
                if (json.status == 1) {
                    alert(json.msg);
                    window.location.reload();
                } else {
                    alert(json.msg);
                }
            };
            return _POST(MNG_SEO.settings.URL_ACTION + 'keyword/multiRemove', data, callBack);
        }
    }

};

/***
 * @public
 * @name: show_notify
 * @note: Hiển thị notify từ thư viện pnotify.min.js
 */
function show_notify($title, $type, $icon, $text) {
    new PNotify({
        title: $title,
        text: $text,
        icon: $icon,
        type: $type
    });
}

/***
 * @public
 * @name: isUrlValid
 * @note: validate url link
 */
function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

/***
 * @param table
 * @name: checkAll
 * @note: checked check box in table
 */
function checkAll(table) {
    jQuery("#checkAll").change(function () {
        jQuery("#" + table + " input:checkbox").prop('checked', $(this).prop("checked"));
        $(".styled.js-bl-ck").uniform({
            radioClass: 'choice'
        });
    });
}

/***
 * @param table
 * @param cbName
 * @name: getCheckBoxVal
 * @note: get checked value of checkbox in table
 */
function getCheckBoxVal(table, cbName) {
    var ids = '';
    var first = true;
    jQuery("#" + table + " tbody input[name=" + cbName + "]:checked").each(function () {
        if (first) {
            ids += jQuery(this).val();
            first = false;
        } else {
            ids += ',' + jQuery(this).val();
        }
    });
    return ids;
}

/***
 * @param name
 * @name: triggerInput
 * @note: trigger click function of id
 */
function triggerInput(name) {
    jQuery('#' + name).trigger('click');
}

/***
 * @param obj
 * @name: validate_link
 * @note: validate link format
 */
function validate_link(obj) {
    var val = obj.val();
    var parent = obj.parent();
    var html = '';
    if (val === undefined || val == '') {
        return false;
    }
    parent.removeClass('has-warning has-success has-error');
    parent.find('.form-control-feedback').remove();
    if (!isUrlValid(val)) {
        show_notify('Lưu ý', 'warning', 'icon-warning2', 'Link của bạn chưa đúng định dạng');
        parent.addClass('has-warning ');
        html = '<div class="form-control-feedback right10"><i class="icon-notification2"></i></div>';
    } else {
        parent.addClass('has-success');
        html = '<div class="form-control-feedback right10"><i class="icon-checkmark-circle"></i></div>';
    }
    obj.after(html);
}

/***
 * @param inputName
 * @param focus
 * @name: validateInput
 * @note: validate input
 */
function validateInput(inputName, focus) {
    var input = jQuery('input[name=' + inputName + ']');
    if (input === undefined) {
        return false;
    }
    var parent = input.parent(); //div parent
    parent.removeClass('has-warning has-success has-error').addClass('has-error');
    parent.find('.form-control-feedback').remove();
    input.after('<div class="form-control-feedback right10"><i class="icon-cancel-circle2"></i></div>');
    if (focus) {
        input.focus();
    }
}

/***
 * @param form
 * @name: validateInput
 * @note: validate input
 */
function removeError(form) {
    jQuery('#' + form + ' input').change(function () {
        jQuery(this).parent().removeClass('has-warning has-success has-error').find('.form-control-feedback').remove();
    });
}