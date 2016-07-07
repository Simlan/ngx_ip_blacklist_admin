$(function () {
    $(".tree-default").fancytree({
        init: function (event, data) {
            $('.has-tooltip .fancytree-title').tooltip();
        }
    });
    $(".tree-table").fancytree({
        extensions: ["table"],
        // checkbox: true,
        table: {
            indentation: 40,      // indent 20px per node level
            nodeColumnIdx: 1,     // render the node title into the 1nd column
            // checkboxColumnIdx: 0  // render the checkboxes into the 1st column
        },
        source: {
            url: BASE_URL + "/admin/cate/ajax-get-categories"
        },
        renderColumns: function (event, data) {
            var node = data.node,
                $tdList = $(node.tr).find(">td");
            // (index #0 is rendered by fancytree by adding the checkbox)
            //$tdList.eq(2).text(node.getIndexHier()).addClass("alignRight");

            // (index #2 is rendered by fancytree)
            $tdList.eq(2).text(node.data.type_des);
            element_edit = "<a class='btn btn-default btn-xs' href='" + BASE_URL + "/admin/cate/input?id=" + node.data.id + "'>Sửa <i class='icon-wrench2 position-right'></i></a>";
            element_delete = "<a class='btn btn-default btn-xs' href='javascript:void(0)' onclick='delete_cate(" + node.data.id + ")'>Xóa <i class='icon-trash position-right'></i></a>";
            checked = '';
            if (node.data.status == 2) checked = 'checked="checked"';
            element_switch = '<input data-id="' + node.data.id + '" ' + checked + ' type="checkbox" data-on-text="Hiện" data-off-text="Ẩn" class="switch switch-status" data-size="small" onchange="change_status_cate(this.checked, ' + node.data.id + ')">';
            $tdList.eq(3).html(element_edit + ' ' + element_delete + element_switch);
            // Style checkboxes
            //$(".styled").uniform({radioClass: 'choice'});
            $(".switch").bootstrapSwitch();
        }
    });

    // Select with search
    $('.select-search').select2();
    $('.select').select2({
        minimumResultsForSearch: "-1"
    });

    // $('#categories-form').submit(function(){
    $('.save-btn-form').click(function (event) {
        is_back = $(this).val();
        $('save-btn-form').attr('disabled', true);
        $.ajax({
            url: BASE_URL + '/admin/cate/input-save',
            type: 'POST',
            dataType: 'JSON',
            data: $("#categories-form").serialize() + "&is_back=" + is_back,
        }).success(function (data) {
            if (data.status == 1) {
                $("html, body").animate({scrollTop: 0}, "slow");
                var error_html = '<div class="alert alert-danger"><ul>';
                $.each(data.data, function (k, v) {
                    error_html += '<li>' + v + '</li>';
                });
                error_html += '</ul></div>';
                $('.validate-form-error').html(error_html);
                $('save-btn-form').attr('disabled', false);
            } else {
                $('.validate-form-error').html("");
                if (data.data.redirect == 1) {
                    location.href = BASE_URL + '/admin/cate';
                } else {
                    if (data.data.action != 'update') {
                        $("#categories-form")[0].reset();
                        rebuild_select2();
                    }
                    new PNotify({
                        title: 'Đã lưu',
                        text: '',
                        icon: 'icon-checkmark3',
                        type: 'success'
                    });
                }
            }
        });
        return false;
    });

    $('.switch-status').on("change", function () {
        alert("The paragraph was clicked.");
    });

});

function change_status_cate(is_checked, id) {
    if (is_checked) {
        v = 2;
    } else {
        v = 1;
    }
    $.ajax({
        url: BASE_URL + '/admin/cate/update',
        type: 'POST',
        dataType: 'JSON',
        data: {'id': id, 'status': v},
    }).success(function (data) {
        if (data.status == 1) {
            alert('Có lỗi trong quá trình xử lý, vui lòng kiểm tra lại');
        }
    })
}

function delete_cate(id) {
    if (confirm("Bạn chắc chắn muốn xóa danh mục này?")) {
        v = 3;
        $.ajax({
            url: BASE_URL + '/admin/cate/update',
            type: 'POST',
            dataType: 'JSON',
            data: {'id': id, 'status': v},
        }).success(function (data) {
            if (data.status == 1) {
                alert('Có lỗi trong quá trình xử lý, vui lòng kiểm tra lại');
            } else if (data.status == 2) {
                alert(data.message);
            } else {
                location.href = BASE_URL + '/admin/cate';
            }
        })
    }
}

function rebuild_select2() {
    $('.select-search').select2("destroy");
    $('.select').select2("destroy");
    $('.select-search').select2();
    $('.select').select2({
        minimumResultsForSearch: "-1"
    });
}