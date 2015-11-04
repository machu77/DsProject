
function judgedetailfun(_strcode, _strparam) {
    var options = {
        type: "POST",
        url: "../../commonfunction/judegeauthor.aspx",
        data: { pcode: _strcode },
        success: function (res) {
            var json = common.Util.StringToJson(res);
            if (json.ErrorCode == "000001") {
                if (!_strparam) {
                    window.location.href = json.ErrorMessage;
                }
                else {
                    window.location.href = json.ErrorMessage + "?" + _strparam;
                }
            }
            else if (json.ErrorCode == "000002") {
                if (json.ErrorMessage) {
                    if (!_strparam) {
                        eval(json.ErrorMessage + "()");
                    }
                    else {
                        if (!common.Validate.ValidateNatNumber(_strparam) && !common.Validate.ValidateFloat(_strparam)) {
                            if (_strparam.indexOf(',') > 0) {
                                eval(json.ErrorMessage + "(" + _strparam + ")");
                            }
                            else {
                                eval(json.ErrorMessage + "('" + _strparam + "')");
                            }
                        }
                        else {
                            eval(json.ErrorMessage + "(" + _strparam + ")");
                        }
                    }
                }
            }
            else {
                alert(json.ErrorMessage);
                return;
            }
        }
    };
    common.Ajax("JudegeFunction", options);
}


String.prototype.getQuery = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = this.substr(this.indexOf("/?") + 1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function A_exit() {
    if (confirm("你确定要退出吗?") == true) {
        location.replace("../ClearIE.aspx");
        event.returnValue = false;
        return true;
    } else {
        return false;
    }
}

function denyscroll() {
    $(document.body).css({
    "overflow-x":"hidden",
    "overflow-y": "hidden"
    });

}

function openwin(winname, _width, _height, _modal, closefun) {
    $('#' + winname).window({
        width: _width,
        height: _height,
        modal: _modal,
        onClose: function () {
            if (closefun) {
                eval(closefun + '()');
            }
        }
    });
    $('#' + winname).show();
}

function GetGridData(gridname, keyid) {
    var rows = $('#' + gridname).datagrid('getSelections');
    if (!rows || rows.length == 0) {
        return "";
    }
    var parm = "";
    $.each(rows, function (i, n) {
        if (i == 0) {
            eval("parm += n." + keyid);
        } else {
            eval("parm += ',' + n." + keyid);
        }
    });
    return parm;
}

function loadgrid(gridname, data) {
    $('#' + gridname).datagrid('loadData', data);
    $('#' + gridname).datagrid('loaded');
    $('#' + gridname).datagrid('unselectAll');
}

function formatgrid(gridname, reloadfunname, numbercontrol, sizecontrol,sortnamecontrol,sortdirectcontrol) {
    $('#' + gridname).datagrid({ onSortColumn: function (sort, order) {
        $("#" + sortnamecontrol).val(sort);
        $("#" + sortdirectcontrol).val(order);
        eval(reloadfunname + '()');
    }
    });
    var p = $('#' + gridname).datagrid('getPager');
    $(p).pagination({
        pageSize: 10, //每页显示的记录条数，默认为10  
        beforePageText: '第', //页数文本框前显示的汉字  
        afterPageText: '页    共 {pages} 页',
        displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录',
        onRefresh: function (pageNumber, pageSize) {
            $("#" + numbercontrol).val(pageNumber);
            $("#" + sizecontrol).val(pageSize);
            eval(reloadfunname + '()');
        },
        onSelectPage: function (pageNumber, pageSize) {
            $("#" + numbercontrol).val(pageNumber);
            $("#" + sizecontrol).val(pageSize);
            eval(reloadfunname + '()');
        }
    });
}

function autoscroll() {
    $(document.body).css({
        "overflow-x": "hidden",
        "overflow-y": "hidden"
    });

}

function displayinfo() {
    var xleft = $("#divuserinfo").offset().left;
    var xtop = $("#divuserinfo").offset().top;
    $("#divdetailuserinfo").css("left", xleft - 60);
    $("#divdetailuserinfo").css("top", xtop + 24);
    $("#divdetailuserinfo").css("display", "block");
    $("#infoarrow").html("<img src='../images/userinfoarrowup.png\' />");
    $("#divuserinfo").css("background-color", "#fff");
    $("#divuserinfo").css("border-top", "solid 1px #BFBFBF");
    $("#divuserinfo").css("border-left", "solid 1px #BFBFBF");
    $("#divuserinfo").css("border-right", "solid 1px #BFBFBF");
    $("#divuserinfo").css("border-bottom", "solid 0px #FFFFFF");
}

function hideinfo() {
    $("#divdetailuserinfo").css("display", "none");
    $("#infoarrow").html("<img src='../images/userinfoarrow.png\' />");
    $("#divuserinfo").css("background-color", "");
    $("#divuserinfo").css("border-color", "rgb(255, 251, 225)");
}

function ShowMessage(message, life) {
    if (!life) {
        var life = 3000;
    }
    if ($('#message').length == 0) {
        $($('<div id="message"><span class="errflag"></span><span class="errmsg">' + message + '</span></div>')).appendTo('body');
    } else {
        $('#message').empty();
        $('#message').html('<span class="errflag"></span><span class="errmsg">' + message + '</span>');
    }
    $(window).resize();
    $('#message').show();

    $('#message').click(function () {
        $(this).hide();
    });

    setTimeout(function() {
        $('#message').hide();
    }, life);
}

$(window).resize(function () {
    $('#message').css({
        position: 'absolute',
        left: ($(window).width() - $('#message').outerWidth()) / 2,
        top: ($(window).height() - $('#message').outerHeight()) / 2 + $(document).scrollTop()
    });
});

function ShowError(message, life) {
    ShowMessage(message, life);
    $('#message span').addClass('error');
}

$(function() {
    //取出焦点超链接的虚线
    $("a").bind("focus",function(){if(this.blur)this.blur();});
    // 在页面加载完成时加载数据源信息
    if (typeof user_datasource != "undefined") {
        for (var data in user_datasource) {
            var name = data.toString();
            var datasource = user_datasource[name];
            common.Data.Datasource[name] = datasource;
        }
    }

    //菜单
    $(".topmenu").mouseover(function() {
        var x = $(this).attr("controldiv");
        if (x != null) {
            $("#m" + x).attr("class", "menu-hdmorehighlight");
            $("#" + x).css("display", "block");
        }
    }).mouseout(function() {
        var x = $(this).attr("controldiv");
        if (x != null) {
            $("#m" + x).attr("class", "menu-hdmore");
            $("#" + x).css("display", "none");
        }
    });

    // 处理form同步提交时的事件
    $("form").each(function(i, obj) {
        var event = $(obj).attr("onserversubmit");
        if (event) {
            $(obj).append("<input type='hidden' name='event' value='" + event + "' />");
        }
    });
});

/**
* common类，前端页面框架基本类，一切类都是该类的内部类
* @class common
*/
var common = {

    /**
    * 常量类
    * @class Consts
    * @namespace common
    */
    Consts: {
        /**
        * 成功状态响应码
        * @method SuccessCode
        * @namespace common.Consts
        */
        SuccessCode: "000000",

        /**
        * 功能列表
        * @class Funcs
        * @namespace common.Consts
        */
        Funcs: {
            /**
            * 登录系统管理应用
            * @method AdminLogin
            * @namespace common.Consts
            */
            AdminLogin: "1",

            /**
            * 登录党建评测应用
            * @method ExamLogin
            * @namespace common.Consts
            */
            ExamLogin: "2",

            /**
            * 查看本部门表单
            * @method ViewForms
            * @namespace common.Consts
            */
            ViewForms: "3",

            /**
            * 查看其它部门表单
            * @method ViewOtherForms
            * @namespace common.Consts
            */
            ViewOtherForms: "4",

            /**
            * 提交本部门表单
            * @method SubmitForms
            * @namespace common.Consts
            */
            SubmitForms: "5",

            /**
            * 管理表单
            * @method ManageForms
            * @namespace common.Consts
            */
            ManageForms: "6"
        }
    },

    /**
    * ajax请求接口
    * @method Ajax
    * @namespace common
    * @param event {string} 事件名称
    * @param options {json} Ajax请求设定，参见jquery帮助
    * @param page_load {bool} 标识是否在事件执行过后执行PageLoad
    */
    Ajax: function (event, options, page_load) {
        var pageLoad = false;
        if (page_load) {
            pageLoad = true;
        }

        if (typeof options.async == "undefined") {
            options.async = true;
        }

        // data参数赋值
        if (!options.data) {
            options.data = {};
        }

        // 事件参数处理
        if (event) {
            if (typeof options.data == "string") {
                options.data += "&event=" + event;
                options.data += "&page_load=" + pageLoad;
            }
            else {
                options.data.event = event;
                options.data.page_load = pageLoad;
            }
        }

        // Ajax参数初始化并执行
        var settings = {
            url: options.url ? options.url : location.href + "",
            cache: options.cache,
            type: options.type,
            data: options.data,
            dataType: options.dataType,
            async: options.async,
            success: options.success,
            error: options.error
        }

        $.ajax(settings);
    },

    /**
    * 工具类
    * @class Util
    * @namespace common
    */
    Util: {
        /**
        * 将String转换成Json对象
        * @method StringToJson
        * @param input {string} 输入字符串
        * @namespace common
        * @return {object} json对象
        */
        StringToJson: function (input) {
            if (typeof input != 'string') {
                return null;
            }
            try {
                var obj = eval("(" + input + ")");
                return obj;
            }
            catch (e) {
                return null;
            }
        }
    },

    /**
    * Repeater工具类
    * @class Repeater
    * @namespace common
    */
    Repeater: {

        /**
        * 获取或设置当前页面所有Repeater控件的设置
        * @method AllSettings
        * @namespace common.Repeater
        */
        AllSettings: {},

        /**
        * 获取或设置当前页面所有Repeater控件的数据源
        * @method AllDatasource
        * @namespace common.Repeater
        */
        AllDatasource: {},

        /**
        * 获取或设置当前页面所有Repeater控件的客户端分页事件
        * @method OnPageIndexChanged
        * @namespace common.Repeater
        */
        OnPageIndexChanged: {},

        /**
        * 生成Repeater的行和列
        * @method CreateRows
        * @param repeaterId {string} Repeater控件Id
        * @param datasource {object} JSON格式的数据源
        * @param settings   {object} Repeater显示设置
        * @namespace common.Repeater
        */
        Repeat: function (repeaterId, datasource, settings) {
            var _instance = $("#" + repeaterId);
            var _pager = null;
            var _current = datasource.current;
            var _pages = datasource.pages;
            var _total = datasource.total;
            var _postData = settings.postData;
            var _id = settings.id;

            if (!_instance) {
                throw "id为" + repeaterId + "的repeater控件不存在";
            }

            var html = "";
            var colContent = "";
            var btnContent = "";
            var trBegin = "";
            var trEnd = "</tr>";
            var tdBegin = "";
            var tdEnd = "</td>";
            var tdHide = "<td style='display:none'>"

            if (typeof settings.rowClass == "string" && settings.rowClass) {
                trBegin = "<tr class='" + settings.rowClass + "'>";
            }
            else {
                trBegin = "<tr>";
            }

            if (typeof settings.colClass == "string" && settings.colClass) {
                tdBegin = "<td class='" + settings.colClass + "'>";
            }
            else {
                tdBegin = "<td>";
            }

            if (!settings.noDataShow) {
                settings.noDataShow = "未查到符合条件的记录";
            }

            if (datasource.data.length == 0) {
                var colSpan = settings.cols.length;
                if (settings.buttons && settings.buttons.length > 0) {
                    colSpan += 1;
                }

                html += trBegin;
                html += tdBegin;
                html = html.substr(0, html.length - 1) + "colspan='" + colSpan + "'>";
                html += settings.noDataShow;
                html += tdEnd;
                html += trEnd;
                _instance.find("tbody").html(html);
            }
            else {
                if (settings.checkboxCol) {
                    if (!settings.checkboxCol.dataCol) {
                        throw "checkboxCol缺少dataCol属性";
                    }
                    else {
                        if (!settings.checkboxCol.checkedValue) {
                            throw "checkboxCol缺少checkedValue属性";
                        }

                        if (!settings.checkboxCol.valueCol) {
                            throw "checkboxCol缺少valueCol属性";
                        }
                    }
                }

                // 生成行和列
                for (var i = 0; i < datasource.data.length; i++) {
                    html += trBegin;
                    colContent = "";
                    btnContent = "";

                    if (settings.checkboxCol) {
                        var tdBeginTemp = tdBegin;
                        var style = settings.checkboxCol["style"];
                        if (style) {
                            tdBeginTemp = tdBegin.substring(0, tdBegin.lastIndexOf(">")) + "style='" + style + "'" + ">";
                        }

                        // 处理checkbox列
                        var checkboxValue = datasource.data[i][settings.checkboxCol.valueCol];
                        if (datasource.data[i][settings.checkboxCol.dataCol] == settings.checkboxCol.checkedValue) {
                            colContent += tdBeginTemp + "<input type='checkbox' value='" + checkboxValue + "' repeater_id='" + repeaterId + "' id='chk_" + repeaterId + "_" + i.toString() + "' checked='checked' />" + tdEnd;
                        }
                        else {
                            colContent += tdBeginTemp + "<input type='checkbox' value='" + checkboxValue + "' repeater_id='" + repeaterId + "' id='chk_" + repeaterId + "_" + i.toString() + "' />" + tdEnd;
                        }
                    }

                    for (var j = 0; j < settings.cols.length; j++) {

                        var tdBeginTemp = tdBegin;

                        // 处理列样式
                        if (settings.cols[j]["style"]) {
                            var style = settings.cols[j]["style"];
                            tdBeginTemp = tdBegin.substring(0, tdBegin.lastIndexOf(">")) + " style='" + style + "'" + ">";
                        }

                        if (settings.cols[j]["classname"]) {
                            var sclass = settings.cols[j]["classname"];
                            tdBeginTemp = tdBeginTemp.substring(0, tdBeginTemp.lastIndexOf(">")) + " class='" + sclass + "'" + ">";
                        }
                        // 加载主键
                        if (_id) {
                            colContent += tdHide + datasource.data[i][_id] + tdEnd;
                        }

                        if (!settings.cols[j]["name"]) {
                            throw "cols缺少name属性";
                        }

                        if (settings.cols[j].name != _id) {
                            // 处理隐藏列
                            if (typeof settings.cols[j]["hidden"] != "boolean") {
                                settings.cols[j]["hidden"] = false;
                            }

                            if (settings.cols[j]["hidden"]) {
                                colContent += tdHide + datasource.data[i][settings.cols[j].name] + tdEnd;
                            }
                            else {
                                colContent += tdBeginTemp + datasource.data[i][settings.cols[j].name] + tdEnd;
                            }
                        }
                    }

                    if (!settings.buttons) {
                        settings.buttons = [];
                    }

                    if (!settings.buttonEvents) {
                        settings.buttonEvents = [];
                    }

                    if (!settings.buttonSplit) {
                        settings.buttonSplit = "";
                    }

                    // 生成按钮列
                    if (settings.buttons.length > 0) {
                        btnContent += tdBegin;
                        var split = settings.buttonSplit;
                        for (var k = 0; k < settings.buttons.length; k++) {
                            var name = settings.buttons[k].name;
                            if (!name) {
                                throw "buttons缺少name属性";
                            }

                            var display = settings.buttons[k].display;
                            if (!display) {
                                settings.buttons[k].display = name;
                            }

                            var type = settings.buttons[k].type;
                            if (!type) {
                                type = "link";
                                settings.buttons[k].type = type;
                            }

                            var classes = settings.buttons[k].classes;
                            if (!classes) {
                                classes = "";
                                settings.buttons[k].classes = classes;
                            }

                            if (type == "link") {
                                var href = settings.buttons[k].href;
                                if (!href) {
                                    href = "#";
                                    settings.buttons[k].href = href;
                                }

                                if (k != 0) {
                                    btnContent += split;
                                }

                                btnContent += "<a rownum='" + i + "' repeater_id='" + repeaterId + "' repeater_button_name='" + name + "' href='" + href + "' class='" + classes + "'>" + display + "</a>";
                            }
                            else if (type == "button") {
                                btnContent += "<input rownum='" + i + "' repeater_id='" + repeaterId + "' repeater_button_name='" + name + "' type='button' value='" + display + "' class='" + classes + "' />" + split;
                            }
                            else {
                                throw "button type只支持link和button类型";
                            }
                        }

                        btnContent += tdEnd;
                    }

                    if (!settings.order) {
                        settings.order = 0;
                    }

                    if (settings.order == 0) {
                        html += colContent + btnContent;
                    }
                    else {
                        html += btnContent + colContent;
                    }

                    html += trEnd;
                }

                _instance.find("tbody").html(html);

                // 处理按钮事件
                for (var i = 0; i < settings.buttonEvents.length; i++) {
                    var name = settings.buttonEvents[i].name;
                    var fun = settings.buttonEvents[i].fun;
                    if (!name) {
                        throw "buttonEvent缺少name属性";
                    }

                    if (typeof fun != "function") {
                        throw "buttonEvent的fun属性必须为function类型";
                    }

                    if (!settings.buttonEvents[i].type) {
                        settings.buttonEvents[i].type = "click";
                    }

                    var eventType = settings.buttonEvents[i].type;
                    $("*[repeater_id='" + repeaterId + "'][repeater_button_name='" + name + "']").each(function (idx, obj) {
                        $(obj).bind(eventType, fun);
                    });
                }
            }

            // 分页控件
            if (typeof settings.pagerId == "string" && settings.pagerId) {
                _pager = $("#" + settings.pagerId);
                if (!_pager) {
                    throw "id为" + settings.pagerId + "的分页控件不存在";
                }

                html = "<div style='width: 100%'>共" + _total + "条信息 第" + _current + "页 共" + _pages + "页";
                html += " | <a href='#' onclick=\"common.Repeater.FirstPage('" + repeaterId + "')\">首页</a>";
                html += " | <a href='#' onclick=\"common.Repeater.PrevPage('" + repeaterId + "')\">上一页</a>";
                html += " | <a href='#' onclick=\"common.Repeater.NextPage('" + repeaterId + "')\">下一页</a>";
                html += " | <a href='#' onclick=\"common.Repeater.LastPage('" + repeaterId + "')\">尾页</a>";
                html += " | 跳转到第<input id='" + repeaterId + "_pager_goto' type='text' id='textfield4' style='width: 20px' />页 <a href='#' onclick=\"common.Repeater.Goto('" + repeaterId + "', 4)\">跳转</a>";
                html += "</div>";

                _pager.html(html);
            }

            // 服务器端分页事件名称
            if (!settings.pageIndexChangedEvent) {
                settings.pageIndexChangedEvent = "OnPageIndexChanged";
            }

            // 客户端分页事件
            if (typeof settings.onPageIndexChanged == "function") {
                common.Repeater.OnPageIndexChanged[repeaterId] = settings.onPageIndexChanged;
            }

            // 保存当前Repeater控件的设置和数据源
            common.Repeater.AllSettings[repeaterId] = settings;
            common.Repeater.AllDatasource[repeaterId] = datasource;
        },

        /**
        * 分页控件--跳转到首页
        * @method FirstPage
        * @namespace common.Repeater
        */
        FirstPage: function (repeaterId) {
            common.Repeater.Goto(repeaterId, 0);
        },

        /**
        * 分页控件--跳转到上一页
        * @method PrevPage
        * @namespace common.Repeater
        */
        PrevPage: function (repeaterId) {
            common.Repeater.Goto(repeaterId, 1);
        },

        /**
        * 分页控件--跳转到下一页
        * @method NextPage
        * @namespace common.Repeater
        */
        NextPage: function (repeaterId) {
            common.Repeater.Goto(repeaterId, 2);
        },

        /**
        * 分页控件--跳转到尾页
        * @method LastPage
        * @namespace common.Repeater
        */
        LastPage: function (repeaterId) {
            common.Repeater.Goto(repeaterId, 3);
        },

        /**
        * 分页控件--跳转到指定页
        * @method Goto
        * @namespace common.Repeater
        */
        Goto: function (repeaterId, oper) {
            if (!repeaterId) {
                alert("请点击“查询”按钮后再点我");
                return;
            }

            var datasource = common.Repeater.AllDatasource[repeaterId];
            var settings = common.Repeater.AllSettings[repeaterId];
            var postData = {};
            if (settings.postData) {
                postData = settings.postData;
            }

            var options = {
                type: "POST",
                data: postData,
                success: function (res) {
                    var datasource = common.Util.StringToJson(res);
                    var settings = common.Repeater.AllSettings[repeaterId];

                    // 重新绑定Repeater
                    common.Repeater.Repeat(repeaterId, datasource, settings);

                    // 执行客户端分页事件
                    var fun = common.Repeater.OnPageIndexChanged[repeaterId];
                    if (typeof fun == "function") {
                        fun();
                    }
                }
            };

            switch (oper) {
                case 0: // 首页
                    options.data.repeater_page_current = 1;
                    break;
                case 1: // 上一页
                    options.data.repeater_page_current = parseInt(datasource.current) - 1;
                    break;
                case 2: // 下一页
                    options.data.repeater_page_current = parseInt(datasource.current) + 1;
                    break;
                case 3: // 尾页
                    options.data.repeater_page_current = datasource.pages;
                    break;
                default: // 跳转
                    options.data.repeater_page_current = $("#" + repeaterId + "_pager_goto").val();
                    break;
            }

            if (isNaN(options.data.repeater_page_current)) {
                alert("无效页码");
                return;
            }

            if (options.data.repeater_page_current < 1 || options.data.repeater_page_current > datasource.pages) {
                alert("超出页码范围");
                return;
            }

            options.data.repeater_page_size = 10;

            common.Ajax(settings.pageIndexChangedEvent, options, false);
        },

        /**
        * 获取指定行的数据
        * @method GetRowData
        * @namespace common.Repeater
        * @return JSON格式的行数据对象
        */
        GetRowData: function (repeaterId, rIndex) {
            if (!repeaterId) {
                throw "repeaterId不能为空";
            }

            var datasource = common.Repeater.AllDatasource[repeaterId];
            if (!datasource) {
                throw "repeaterId对应的datasource不存在";
            }

            return datasource.data[rIndex];
        },

        /**
        * 绑定自定义按钮事件
        * @method BindEvent
        * @namespace common.Repeater
        */
        BindEvent: function (repeaterId, buttonName, eventType, fn) {
            if (!repeaterId) {
                throw "repeaterId不能为空";
            }

            if (typeof fn != "function") {
                throw "绑定事件必须为function对象";
            }

            var settings = common.Repeater.AllSettings[repeaterId];
            if (!settings) {
                throw "repeaterId对应的settings不存在";
            }

            var btn = null;
            for (var i = 0; i < settings.buttons.length; i++) {
                if (settings.buttons[i].name == buttonName) {
                    btn = settings.buttons[i];
                    break;
                }
            }

            if (btn == null) {
                throw "buttonName为" + buttonName + "的按钮设置不存在";
            }

            if (btn.type == "link") {
                $("a[repeater_id='" + repeaterId + "'][repeater_button_name='" + buttonName + "']").bind(eventType, fn);
            }
            else {
                $(":button[repeater_id='" + repeaterId + "'][repeater_button_name='" + buttonName + "']").bind(eventType, fn);
            }
        },

        /**
        * 获取Repeater checkbox列中所有选中的checkbox值，“|”分割
        * @method GetCheckedValue
        * @return 所有选中的checkbox值
        * @namespace common.Repeater
        */
        GetCheckedValue: function (repeaterId) {
            var checkedValue = "";
            $("#" + repeaterId + " tbody").find(":checked").each(function (i, obj) {
                checkedValue += $(this).val() + "|";
            });

            if (checkedValue.length > 0) {
                checkedValue = checkedValue.substr(0, checkedValue.length - 1);
            }

            return checkedValue;
        }
    },

    /**
    * 数据源类
    * @class Data
    * @namespace common
    */
    Data: {

        /**
        * 当前页面数据源集合
        * @method Datasource
        * @namespace common.Data
        */
        Datasource: {},

        /**
        * 获取指定名称的数据源对象
        * @method GetDatasource
        * @namespace common.Data
        */
        GetDatasource: function (name) {
            if (common.Data.Datasource[name]) {
                return common.Data.Datasource[name];
            }

            return null;
        }
    },

    /**
    * DropDownList工具类
    * @class DropDownList
    * @namespace common
    */
    DropDownList: {

        /**
        * 初始化DropDownList控件
        * @method Load
        * @namespace common.DropDownList
        */
        Load: function (controlId, datasource, textName, valueName) {
            var _instance = $("#" + controlId);
            if (!_instance) {
                throw "id为" + controlId + "的下拉框不存在";
            }

            for (var i = 0; i < datasource.length; i++) {
                _instance.append("<option value='" + datasource[i][valueName] + "'>" + datasource[i][textName] + "</option>");
            }
        },

        /**
        * 移除下拉框中的选项
        * @method Remove
        * @namespace common.DropDownList
        */
        Remove: function (controlId, removeFirstOption) {
            var _instance = $("#" + controlId);
            if (!_instance) {
                throw "id为" + controlId + "的下拉框不存在";
            }

            if (removeFirstOption) {
                var length = _instance.find("option").length;
                _instance.find("option").remove();
            }
            else {
                var length = _instance.find("option:gt(0)").length;
                _instance.find("option:gt(0)").remove();
            }
        }
    },

    /**
    * 模糊查找控件工具类
    * @class FuzzyQuery
    * @namespace common
    */
    FuzzyQuery: {

        /**
        * 获取或设置当前页面所有FuzzyQuery控件的设置
        * @method AllSettings
        * @namespace common.FuzzyQuery
        */
        AllSettings: {},

        /**
        * 获取或设置当前页面所有FuzzyQuery控件的数据源
        * @method AllDatasource
        * @namespace common.FuzzyQuery
        */
        AllDatasource: {},

        /**
        * 初始化模糊查找控件
        * @method Init
        * @namespace common.FuzzyQuery
        * @param settings {object} FuzzyQuery设置
        */
        Init: function (settings) {
            if (!settings) {
                throw "FuzzyQuery settings为空";
            }

            var inputId = settings.inputId; // FuzzyQuery控件Id
            var instance = $("#" + inputId);
            var event = settings.onDataChanged; // 数据发生变化时的服务器端事件
            var dataControlId = settings.dataControlId; // 数据填充的控件Id
            var dataKeyName = settings.dataKeyName; // 数据源的主键字段名称
            var dataShowName = settings.dataShowName; // 数据源中界面显示的字段名称
            var panelClass = settings.panelClass; // 设置FuzzyQuery的Panel样式
            var noDataShow = settings.noDataShow; // 设置FuzzyQuery在获取到的数据为空的情况下显示的信息
            var mode = settings.mode; // 设置FuzzyQuery的数据请求方式， local 本地数据源，server 向服务器端请求数据
            var triggerImg = settings.triggerImg; // 设置FuzzyQuery的触发按钮图片
            var triggerToggleImg = settings.triggerToggleImg; // 设置FuzzyQuery的触发按钮的切换图片

            if (!instance) {
                throw "id为" + inputId + "的FuzzyQuery控件不存在";
            }

            if (!inputId) {
                throw "FuzzyQuery inputId为空";
            }

            if (!dataControlId) {
                throw "FuzzyQuery dataControlId为空";
            }

            if (!dataKeyName) {
                throw "FuzzyQuery dataKeyName为空";
            }

            if (!dataShowName) {
                throw "FuzzyQuery dataShowName为空";
            }

            // mode处理
            if (!mode) {
                settings.mode = "local"; // 本地加载
            }

            // noDataShow处理
            if (!settings.noDataShow) {
                settings.noDataShow = "未查到符合条件的记录";
            }

            // triggerImg处理
            if (!settings.triggerImg) {
                settings.triggerImg = "../images/trigger.png";
            }

            // triggerToggleImg处理
            if (!settings.triggerToggleImg) {
                settings.triggerToggleImg = "../images/trigger2.png";
            }

            // 保存settings
            common.FuzzyQuery.AllSettings[inputId] = settings;

            // trigger
            instance.after("<img control='" + inputId + "' src='" + settings.triggerImg + "' style='position:absolute; cursor:pointer' onclick=\"common.FuzzyQuery.Trigger('" + inputId + "')\" />");

            var bindEvent = null;
            if ($.browser.msie) {
                bindEvent = "propertychange";
            }
            else {
                bindEvent = "input";
            }

            var fun = function () {
                common.FuzzyQuery.SearchData(inputId);
            };

            // 绑定控件监听事件
            $("#" + inputId).bind(bindEvent, fun);

            // 绑定onblur事件
            instance.bind("blur", function () {
                //var item =  $("li[fuzzycontrol='true'][selected='selected']");
                //                if(item.length == 0) {
                //                    // 没有数据
                //                    $("#" + inputId).unbind(bindEvent);
                //                    $("#" + inputId).val("");
                //                    $("#" + dataControlId).val("");
                //                    $("#" + inputId).bind(bindEvent, fun);
                //                }
                //                else {
                //                    item.click();
                //                }

                //item.click();    

                // 销毁Panel
                //$("#fuzzyPanel_" + inputId).remove();
            });
        },

        /**
        * 异步加载数据
        * @method SearchData
        * @namespace common.FuzzyQuery
        * @param inputId {string} FuzzyQuery控件Id
        * @param val {string} 指定的查询值
        */
        SearchData: function (inputId, val) {
            var settings = common.FuzzyQuery.AllSettings[inputId];
            if (!settings) {
                throw 'Id为' + fqId + "的FuzzyQuery settings不存在";
            }

            var instance = $("#" + inputId);
            var value = null;
            if (!val) {
                value = $.trim(instance.val());
            }
            else {
                value = $.trim(val);
            }

            var options = {
                type: "POST",
                data: {
                    input: value
                },
                success: function (res) {
                    var json = common.Util.StringToJson(res);
                    if (!json) {
                        return;
                    }

                    // 展现下拉列表
                    common.FuzzyQuery.Show(inputId, json);
                }
            };

            // ajax请求服务器端数据
            if (settings.mode == "server") {
                common.Ajax(settings.onDataChanged, options);
            }
            else {
                if (!settings.localDatasource) {
                    return;
                }

                // 本地数据源中获取
                var datasource = common.Data.GetDatasource(settings.localDatasource);
                if (!datasource) {
                    return;
                }

                var serData = new Array();

                if (!value) {
                    // 展现全部
                    for (var i = 0; i < datasource.length; i++) {
                        serData.push(datasource[i]);
                    }
                }
                else {
                    // 遍历数据源
                    for (var i = 0; i < datasource.length; i++) {
                        if (datasource[i][settings.dataShowName].indexOf(value) >= 0) {
                            serData.push(datasource[i]);
                        }
                    }
                }

                common.FuzzyQuery.Show(inputId, serData);
            }
        },

        /**
        * 控件选项选择事件
        * @method OnSelectChanged
        * @namespace common.FuzzyQuery
        * @param inputId {string} FuzzyQuery控件Id
        * @param idx {int} 选择项索引
        */
        OnSelectChanged: function (inputId, idx) {
            var settings = common.FuzzyQuery.AllSettings[inputId];
            if (!settings) {
                throw 'Id为' + inputId + "的FuzzyQuery settings不存在";
            }

            var datasource = common.FuzzyQuery.AllDatasource[inputId];

            if (!datasource) {
                return;
            }

            if (datasource.length <= idx) {
                return;
            }

            var instance = $("#" + settings.inputId);
            var dataControl = $("#" + settings.dataControlId);

            var bindEvent = null;
            if ($.browser.msie) {
                bindEvent = "propertychange";
            }
            else {
                bindEvent = "input";
            }

            // 解除控件监听事件
            instance.unbind(bindEvent);

            // 回填查询到的值            
            var data = datasource[idx];
            instance.val(data[settings.dataShowName]);
            dataControl.val(data[settings.dataKeyName]);

            // 重新绑定oninput事件
            instance.bind(bindEvent, function () {
                common.FuzzyQuery.SearchData(settings.inputId);
            });

            // 销毁Panel
            $("#fuzzyPanel_" + inputId).remove();

            // 重新设置trigger图片
            $("img[control='" + inputId + "']").attr("src", settings.triggerImg);
        },

        /**
        * 展现下拉列表
        * @method Show
        * @namespace common.FuzzyQuery
        * @param inputId {string} FuzzyQuery控件Id
        * @param datasource {object} 数据源
        */
        Show: function (inputId, datasource) {
            // 销毁Panel
            $("#fuzzyPanel_" + inputId).remove();

            var settings = common.FuzzyQuery.AllSettings[inputId];
            if (!settings) {
                throw 'Id为' + inputId + "的FuzzyQuery settings不存在";
            }

            // 保存数据源
            common.FuzzyQuery.AllDatasource[inputId] = datasource;

            var instance = $("#" + inputId);
            var inputWidth = instance.outerWidth();
            inputWidth = parseInt(inputWidth) - 1;
            var html = "<div id='fuzzyPanel_" + inputId + "' style='width:" + inputWidth + "px;' class='" + settings.panelClass + "'>";
            if (datasource.length == 0) {
                html += settings.noDataShow;
            }
            else {
                html += "<ul>";
                for (var i = 0; i < datasource.length; i++) {
                    if (i == 0) {
                        html += "<li selected='selected' fuzzycontrol='true' idx='" + i + "' onclick=\"common.FuzzyQuery.OnSelectChanged('" + inputId + "', '" + i + "');\" style='width: " + inputWidth + "px'><a>" + datasource[i][settings.dataShowName] + "</a></li>";
                    }
                    else {
                        html += "<li selected='' fuzzycontrol='true' idx='" + i + "' onclick=\"common.FuzzyQuery.OnSelectChanged('" + inputId + "', '" + i + "')\" style='width: " + inputWidth + "px'><a>" + datasource[i][settings.dataShowName] + "</a></li>";
                    }
                }

                html += "</ul>";
            }

            html += "</div>";

            // 销毁上一次的Panel
            $("#fuzzyPanel_" + inputId).remove();

            instance.after(html);

            $("li[fuzzycontrol]").hover(
                function () {
                    $(this).attr("selected", "selected");
                },
                function () {
                    $(this).attr("selected", "");
                }
            );
        },

        /**
        * 设置FuzzyQuery控件值
        * @method SetData
        * @namespace common.FuzzyQuery
        * @param inputId {string} FuzzyQuery控件Id
        * @param text {string} 显示数据
        * @param value {string} 数据值
        */
        SetData: function (inputId, text, value) {
            var settings = common.FuzzyQuery.AllSettings[inputId];
            if (!settings) {
                throw 'Id为' + inputId + "的FuzzyQuery settings不存在";
            }

            var bindEvent = null;
            if ($.browser.msie) {
                bindEvent = "propertychange";
            }
            else {
                bindEvent = "input";
            }

            // 解除控件监听事件
            $("#" + inputId).unbind(bindEvent);

            $("#" + inputId).val(text);
            $("#" + settings.dataControlId).val(value);

            // 重新绑定oninput事件
            $("#" + inputId).bind(bindEvent, function () {
                common.FuzzyQuery.SearchData(settings.inputId);
            });
        },

        /**
        * 获取FuzzyQuery控件值
        * @method GetValue
        * @namespace common.FuzzyQuery
        * @param inputId {string} FuzzyQuery控件Id
        * @return {string} FuzzyQuery控件值
        */
        GetValue: function (inputId) {
            var settings = common.FuzzyQuery.AllSettings[inputId];
            if (!settings) {
                throw 'Id为' + inputId + "的FuzzyQuery settings不存在";
            }

            return $("#" + settings.dataControlId).val();
        },

        /**
        * 获取FuzzyQuery trigger点击事件
        * @method Trigger
        * @namespace common.FuzzyQuery
        * @param inputId {string} FuzzyQuery控件Id
        */
        Trigger: function (inputId) {
            var settings = common.FuzzyQuery.AllSettings[inputId];
            if (!settings) {
                throw 'Id为' + inputId + "的FuzzyQuery settings不存在";
            }

            var instance = $("img[control='" + inputId + "']");

            // 图片切换
            var imgSrc = instance.attr("src");
            if (imgSrc == settings.triggerImg) {
                // 展现下拉列表
                common.FuzzyQuery.SearchData(inputId, ' ');

                instance.attr("src", settings.triggerToggleImg);
            }
            else {
                instance.attr("src", settings.triggerImg);

                // 销毁Panel
                $("#fuzzyPanel_" + inputId).remove();
            }
        }
    },

    /**
    * ListBox控件
    * @class ListBox
    * @namespace common
    */
    ListBox: {

        /**
        * 获取或设置当前页面所有ListBox控件的设置
        * @method AllSettings
        * @namespace common.ListBox
        */
        AllSettings: {},

        /**
        * 获取或设置当前页面所有ListBox控件的数据源
        * @method AllDatasource
        * @namespace common.ListBox
        */
        AllDatasource: {},

        /**
        * ListBox控件初始化
        * @method Load
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        * @param datasource {object} 数据源
        * @param settings {object} ListBox控件设置
        */
        Init: function (boxId, datasource, settings) {
            if (!settings) {
                throw "ListBox settings为空";
            }

            var instance = $("#" + boxId); // ListBox控件对象
            //var events = settings.events; // ListBox事件集合
            var dataKeyName = settings.dataKeyName; // 数据源的主键字段名称
            var dataShowName = settings.dataShowName; // 数据源中界面显示的字段名称
            var itemSelectedClass = settings.itemSelectedClass; // ListBox项选中后的样式
            //var onItemSelected;
            //var onItemDoubleClick;

            if (!instance) {
                throw "id为" + inputId + "的FuzzyQuery控件不存在";
            }

            if (!boxId) {
                throw "ListBox boxId为空";
            }

            if (!dataKeyName) {
                throw "ListBox dataKeyName为空";
            }

            if (!dataShowName) {
                throw "ListBox dataShowName为空";
            }

            //            if(!events) {
            //                events = [];
            //            }

            // 保存ListBox控件设置
            common.ListBox.AllSettings[boxId] = settings;

            // 展现ListBox
            common.ListBox.Show(boxId, datasource);
        },

        /**
        * 展现ListBox数据
        * @method Show
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        * @param datasource {object} 数据源
        */
        Show: function (boxId, datasource) {
            var settings = common.ListBox.AllSettings[boxId];
            if (!settings) {
                throw "ListBox settings为空";
            }

            if (!datasource) {
                return;
            }

            // 保存ListBox数据源
            common.ListBox.AllDatasource[boxId] = datasource;

            var instance = $("#" + boxId);
            var html = "<ul>";

            for (var i = 0; i < datasource.length; i++) {
                for (var i = 0; i < datasource.length; i++) {
                    html += "<li listboxitem='true' value='" + datasource[i][settings.dataKeyName] + "' idx='" + i + "' onclick=\"common.ListBox.OnItemSelected('" + boxId + "', " + i + ");\" style='width: " + instance.innerWidth() + "'><a>" + datasource[i][settings.dataShowName] + "</a></li>";
                }
            }

            instance.html(html);
        },

        /**
        * ListBox项选中事件
        * @method OnItemSelected
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        * @param idx {int} 选择项索引
        */
        OnItemSelected: function (boxId, idx) {
            var settings = common.ListBox.AllSettings[boxId];
            if (!settings) {
                throw "ListBox settings为空";
            }

            var instance = $("#" + boxId);
            var items = instance.find("li[listboxitem='true']");
            if (idx >= items.length || idx < 0) {
                return;
            }

            var selItem = items[idx];

            // 选中/取消选中ListBox项
            if ($(selItem).attr("selected")) {
                $(selItem).removeAttr("selected");
                $(selItem).removeClass(settings.itemSelectedClass);
            }
            else {
                $(selItem).attr("selected", true);
                $(selItem).addClass(settings.itemSelectedClass);
            }
        },

        /**
        * 选中所有ListBox项
        * @method SelectAll
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        */
        SelectAll: function (boxId) {
            var settings = common.ListBox.AllSettings[boxId];
            if (!settings) {
                throw "ListBox settings为空";
            }

            var instance = $("#" + boxId);
            instance.find("li[listboxitem='true']").attr("selected", true);
            instance.find("li[listboxitem='true']").addClass(settings.itemSelectedClass);
        },

        /**
        * 获取选中的ListBox项
        * @method GetSelectedItems
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        * @return {object} ListBox项集合
        */
        GetSelectedItems: function (boxId) {
            var instance = $("#" + boxId);
            var items = instance.find("li[listboxitem='true'][selected]");
            var array = [];
            var datasource = common.ListBox.AllDatasource[boxId];
            if (!datasource) {
                return array;
            }

            for (var i = 0; i < items.length; i++) {
                array.push(datasource[$(items[i]).attr("idx")]);
            }

            return array;
        },

        /**
        * 获取所有的ListBox项
        * @method GetAllItems
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        * @return {object} ListBox项集合
        */
        GetAllItems: function (boxId) {
            return common.ListBox.AllDatasource[boxId];
        },

        /**
        * 添加ListBox项
        * @method AddItems
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        * @param items {object} ListBox项集合
        */
        AddItems: function (boxId, items) {
            if (!items) {
                return;
            }

            var datasource = common.ListBox.AllDatasource[boxId];
            if (!datasource) {
                datasource = [];
            }

            for (var i = 0; i < items.length; i++) {
                datasource.push(items[i]);
            }

            common.ListBox.Show(boxId, datasource);
        },

        /**
        * 移除选中的ListBox项
        * @method RemoveSelectedItems
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        */
        RemoveSelectedItems: function (boxId) {
            var instance = $("#" + boxId);
            var datasource = common.ListBox.AllDatasource[boxId];
            if (!datasource) {
                return;
            }

            var items = instance.find("li[listboxitem='true'][selected]");
            var newDatasource = [];
            var idx = "";
            for (var i = 0; i < items.length; i++) {
                idx += $(items[i]).attr("idx") + ",";
            }

            // 排除选中列表，创建新数据源
            for (var i = 0; i < datasource.length; i++) {
                if (idx.indexOf(i + "") >= 0) {
                    continue;
                }

                newDatasource.push(datasource[i]);
            }

            common.ListBox.Show(boxId, newDatasource);
        },

        /**
        * 移除所有的ListBox项
        * @method RemoveAllItems
        * @namespace common.ListBox
        * @param boxId {string} ListBox控件Id
        */
        RemoveAllItems: function (boxId) {
            var datasource = common.ListBox.AllDatasource[boxId];
            if (!datasource) {
                return;
            }

            common.ListBox.AllDatasource[boxId] = [];
            common.ListBox.Show(boxId, []);
        }
    },

    /**
    * 验证方法类
    * @class Validate
    * @namespace common
    */
    Validate: {
        /**
        * 验证输入是否为空
        * @method IsNullOrEmpty 
        * @param input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        IsNullOrEmpty: function (input) {
            if (input) {
                if (typeof input == "string") {
                    if (input.length > 0) {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
        * 验证电子邮件
        * @method ValidateEmail 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateEmail: function (Input) {
            var reg = /^[a-zA-Z0-9\.]+\@[A-Z0-9a-z]+(\.[A-Za-z]+){1,}$/i;
            return reg.test(Input);
        },

        /**
        * 验证自然数（0到正无穷大）
        * @method ValidateNumber 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateNatNumber: function (Input) {
            var reg = /^[0-9]+$/;
            return reg.test(Input);
        },

        /**
        * 验证整数
        * @method ValidateNumber 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateNumber: function (Input) {
            var reg = /^(\-)?[0-9]+$/;
            return reg.test(Input);
        },

        /**
        * 验证浮点数
        * @method ValidateFloat 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateFloat: function (Input) {
            var reg = /^(\-)?[0-9]+([\.][0-9]+)?$/;
            return reg.test(Input);
        },

        /**
        * 验证GUID
        * @method ValidateGUID 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateGUID: function (Input) {
            var reg = /^[A-Fa-f0-9]{8}(-[A-Fa-f0-9]{4}){3}-[A-Fa-f0-9]{12}$/i;
            return reg.test(Input);
        },

        /**
        * 验证金钱
        * @method ValidateMoney 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateMoney: function (Input) {
            var reg = /^[0-9]+([\.][0-9]{0,2})?$/;
            return reg.test(Input);
        },

        /**
        * 验证身份证号码
        * @method ValidateIdCard 
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateIdCard: function (Input) {
            var reg = /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|(\d{3}[Xx]))$/i;
            return reg.test(Input);
        },

        /**
        * 验证输入字符串长度
        * @method ValidateStringLength
        * @param Input {string} 验证字符串
        * @param Max {int} 最大允许长度
        * @param Min {int} 最小允许长度
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateStringLength: function (Input, Max, Min) {
            if (typeof Input != "string") {
                return false;
            }

            var length = Input.length;

            if (Max && Min) {
                return (length >= Min && length <= Max);
            }

            if (Max && !Min) {
                return (length <= Max);
            }

            if (!Max && Min) {
                return (length >= Min);
            }

        },

        /**
        * 验证两个字符串是否相等
        * @method AreEqual
        * @param str1 {string} 字符串1
        * @param str2 {string} 字符串2
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        AreEqual: function (str1, str2) {
            str1 = jQuery.trim(str1);
            str2 = jQuery.trim(str2);

            return (str1 == str2);
        },

        /**
        * 验证两个字符串是否不相等
        * @method NotEqual
        * @param str1 {string} 字符串1
        * @param str2 {string} 字符串2
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        NotEqual: function (str1, str2) {
            str1 = jQuery.trim(str1);
            str2 = jQuery.trim(str2);

            return (str1 != str2);
        },

        /**
        * 验证固定电话
        * @method ValidatePhone
        * @param input {string} 输入字符串 
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidatePhone: function (input) {
            var reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
            return reg.test(input);
        },

        /**
        * 验证移动电话
        * @method ValidateMobile
        * @param input {string} 输入字符串
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateMobile: function (input) {
            var reg = /^(?:13\d|15[0-9]|18[0-9]|17[0-9])-?\d{5}(\d{3}|\*{3})$/;
            return reg.test(input);
        },

        /**
        * 验证Url地址
        * @method ValidateWebsite
        * @param input {string} 输入字符串
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateWebsite: function (input) {
            var reg = /^((http(s)?|ftp|telnet|news|rtsp|mms):\/\/)?(((\w(\-*\w)*\.)+[a-zA-Z]{2,4})|(((1\d\d|2([0-4]\d|5[0-5])|[1-9]\d|\d).){3}(1\d\d|2([0-4]\d|5[0-5])|[1-9]\d|\d).?))(:\d{0,5})?(\/+.*)*$/;
            return reg.test(input);
        },

        /**
        * 验证日期格式（YYYY-MM-DD格式）
        * @method ValidateDateTime
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateDateTime: function (input) {
            var dateReg = /^((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29-))$/;
            return dateReg.test(input);
        },

        /**
        * 验证IP格式
        * @method ValidateIp
        * @param Input {string} 输入
        * @namespace common.Validate
        * @return {bool} 验证结果
        */
        ValidateIp: function (input) {
            var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/;
            return reg.test(input);
        }
    }
};


/** 
* 封装一个公用的方法  
* @param {Object} grid table的id  
* @param {Object} func 获取异步数据的方法  
* @param {Object} time 延时执行时间  
*/  

function Exec_Wait(grid,func,time){   
    var dalayTime = 500;   
    __func_=func;   
    __selector_ = '#' + grid;   
    $(__selector_).datagrid("loading");   
    if (time) {   
        dalayTime = time;   
    }   
    gTimeout=window.setTimeout(_Exec_Wait_,dalayTime);   
}   

function _Exec_Wait_(){   
    try{eval(__func_);   
    }catch(e){   
    alert("__func_:" + __func_ + ";_ExecWait_" + e.message);   
    }finally{   
    window.clearTimeout(gTimeout);   
    $(__selector_).datagrid("loaded");   
    }
}

function refreshtab(_title) {
    var currTab = $('#tt').tabs('getTab', _title);
    $('#tt').tabs('update', {
        tab: currTab,
        options: {
            content: "<iframe id='" + _rel + "' frameborder='no' marginheight='0' marginwidth='0' border='0'  width='100%' height='100%' src='" + _url + "'></iframe>"
        }
    });
}
