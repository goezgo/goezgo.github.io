$(function(){

    $('.drag').draggable({
		appendTo: 'body',
		helper: 'clone'
	});

	$('#dropzone').droppable({
		activeClass: 'active',
		hoverClass: 'hover',
		accept: ".dragBase,.dragCom",
		drop: function (e, ui) {

			var realUnitWidth = 55;
			var tempObj		  = ui.draggable;

			var dropTitle   = tempObj.find('a').attr('title');
			var arrInfo		= tempObj.find('a').attr('rel').split(',');

			var width		= parseInt(arrInfo[1], 10);
			var comgroup    = parseInt(arrInfo[4], 10);
			var height      = parseInt(arrInfo[5], 10);

            var detaillist = "detailList0";
            var extraclass = "zu0";
            var comnum	   = 12;
            var color      = parseInt($('input[name=color]:checked').val(),10);

            //根据颜色选择路径
            arrInfo[0] = color == 0 ?  arrInfo[0].replace('cube','cube-r') : arrInfo[0].replace('cube','cube-b');

			var $el = $('<div class="drop-item '+extraclass+'" style="width:'+width+'px;" rel="'+arrInfo[3]+'" data-detaillist="'+detaillist+'" data-extraclass="'+extraclass+'" data-comgroup="'+comgroup+'"><p class="details"><img src="'+arrInfo[0]+'" style="width:'+width+'px;" /></p></div>');

            /*添加菜单部分*/
            $el.append($('<div class="menu-container"><button type="button" class="btn btn-default btn-xs menu"><i class="fa fa-angle-double-down"></i></button><ul><li><a href="javascript:void(0);" class="removeDrop" data-detaillist="'+detaillist+'" data-extraclass="'+extraclass+'">删除</a></li><li><a href="javascript:void(0);" class="addcompage" data-comlist="'+arrInfo[3]+'">添加配件</a></li></ul></div>'));
            /*添加菜单部分 end*/

			//选择容器
			var top 	= ui.offset.top - 100;//100为#dropzone距离顶部的距离
			top 		= top - top % realUnitWidth + realUnitWidth;
            var topMax  = top + height;
            var left 	= ui.offset.left - (window.screen.width-1320)/2;
            left 		= left - left % realUnitWidth - realUnitWidth;
            left 		= left < 0 ? 0 : left;
            var leftMax = left + width;

            //柜体的边界检查
			if (left >= 1100 || leftMax > 1100) {
                tipspop('请把柜体拖入显示范围');
                return false;
			}
            if (top >= 500 || topMax > 500) {
                tipspop('请把柜体拖入显示范围');
                return false;
            }
            //判断柜体是否重合
			var isExist = false;
            $('.drop-item').each(function(){
                var tempInfo = $(this).attr('shuaiquan').split(',');
                for (var i in tempInfo) {
                    tempInfo[i] = parseInt(tempInfo[i],10);
				}
                if ( (left>=tempInfo[0] && left<tempInfo[1] || leftMax>tempInfo[0] && leftMax<=tempInfo[1]) && (top>=tempInfo[2] && top<tempInfo[3] || topMax>tempInfo[2] && topMax<=tempInfo[3]) ) {
                    isExist = true;
				}
            });
            if (isExist) {
                tipspop('该区域已有柜体');
                return false;
            }

            $el.css({'top':top+'px','left':left+'px'});
            $(this).append($el);

            //柜体的位置信息
            $el.attr('shuaiquan',left+','+leftMax+','+top+','+topMax);

			//添加组件(预加载)
			$el.append($('#comgroup'+comgroup).html());

			var addIndex = $el.index('.'+extraclass);
			var index = 1;
			var html  = '';
			html += '<tr>';
			html += '<td>'+index+'</td>';
			html += '<td>'+arrInfo[2]+'<input class="comgroup" value="'+comgroup+'" type="hidden"/></td>';
			for(var i=0;i<comnum;i++) {
				html += '<td>0</td>';
			}
			html += '</tr>';

			if (addIndex == 0) {
				$('#'+detaillist+' tbody').prepend(html);
			} else {
				var prevIndex = addIndex-1;
				$('#'+detaillist+' tbody tr').eq(prevIndex).after(html);
			}
			$('.'+extraclass).each(function(i){
				$('#'+detaillist+' tbody tr').eq(i).find('td').eq(0).html(i+1);
			});

            //计算总价
            totalPrice();

		}
	});

	//配件上的删除按钮的显示和隐藏
	$('#dropzone').delegate('.drag-item', 'mouseover', function(){
		$(this).find('.remove').show();
	});
	$('#dropzone').delegate('.drag-item', 'mouseout', function(){
		$(this).find('.remove').hide();
	});
	$('#dropzone').delegate('.drop-item', 'mouseover', function(){
		if ($(this).find('.drag-item:visible').length == 0) {
			// $(this).find('.menu').show();
		}
	});
	$('#dropzone').delegate('.drop-item', 'mouseout', function(){
		// $(this).find('.menu').hide();
	});

    $('#dropzone').delegate('.menu-container', 'mouseover', function(){
        $(this).find('ul').show();
    });
    $('#dropzone').delegate('.menu-container', 'mouseout', function(){
        $(this).find('ul').hide();
    });

    /*柜体绑定删除事件*/
    $('#dropzone').delegate('.removeDrop','click',function(){

        var tempExtraclass = $(this).data().extraclass;
        var tempDetaillist = $(this).data().detaillist;

        var tempObj  = $(this).parents('.drop-item');
        var delIndex = tempObj.index('.'+tempExtraclass);

        if (tempObj.find('.drop-item').length > 0) {
            var childObj = tempObj.find('.drop-item').eq(0);
            var tempH    = tempObj.height() - childObj.height();
            childObj.css({'marginTop':tempH+'px'});
        } else {
            tempObj.remove();
        }

        $('#'+tempDetaillist+' tbody tr').eq(delIndex).remove();
        $('.'+tempExtraclass).each(function(i){
            $('#'+tempDetaillist+' tbody tr').eq(i).find('td').eq(0).html(i+1);
        });

        //计算总价
        totalPrice();
    });
    /*柜体绑定删除事件 end*/

    /*柜体绑定添加组件事件*/
    $('#dropzone').delegate('.addcompage','click',function(){

        //定位柜体
        $('.drop-item').removeClass('current');
        var parentObj = $(this).parents('.drop-item');
        parentObj.addClass('current');

        var tempComList = $(this).data().comlist;
        var tempHtml    = '';
        var tempComList = tempComList.split('-');
        for (var i in tempComList) {
            var tempComIndex = tempComList[i].split('_');
            tempHtml += $('.dragCom').eq(tempComIndex[0]).html();
        }
        tempHtml += "<script>";
        tempHtml += "$('.btn-com').click(function(){$(this).addClass('active').siblings().removeClass('active');});";
        tempHtml += "</script>";

        layer.open({
            title: '添加配件',
            content: tempHtml,
            area : ["550px", "500px"],
            yes: function () {
                if (addcom(tempComList)) {
                    layer.closeAll();
                }
            }
        });

    });
    /*柜体绑定添加组件事件 end*/

    //横坐标
    var htmlX = '';
    var index = 0;
    var tempx = 0;
    for(var i=0; i<1200; i+=35) {
        tempx  = index*36.6;
        tempx  = parseFloat(tempx.toFixed(1));
        if (tempx == 732) {
            tempx += "cm";
            htmlX += '<span style="width:30px;">'+tempx+'</span>';
            break;
        } else {
            htmlX += '<span>'+tempx+'</span>';
        }
        index++;
    }
    $('#coor-x').html('').html(htmlX);

    //纵坐标
    var htmlY = '';
    for(var i=9; i>=0; i--) {
        tempy  = i*35.2;
        tempy  = parseFloat(tempy.toFixed(1));
        htmlY += '<span style="height:55px;">'+tempy+'</span>';
    }
    $('#coor-y').html('').html(htmlY);

});

//信息提示
function tipspop(text) {
	layer.msg(text);
}

//添加组件
function addcom()
{
    var currentObj  = $('.drop-item.current');

    var tempObj		= $('.btn-com.active');
    var arrInfo		= tempObj.attr('rel').split(',');
    var dragTitle   = tempObj.attr('title');

    var extraclass  = currentObj.data().extraclass;
    var detaillist  = currentObj.data().detaillist;
    var comgroup    = currentObj.data().comgroup;

    var arrRel      = currentObj.attr('rel').split('-');
    var arrVerify   = new Array();
    for(var i in arrRel) {
        tempArr = arrRel[i].split('_');
        arrVerify[tempArr[0]] = parseInt(tempArr[1], 10);
    }

    var cate     = parseInt(arrInfo[0], 10);

    //不是他的配件
    if (!arrVerify[cate]) {
        var tempTip = dragTitle+'不是'+dropTitle+'的配件';
        tipspop(tempTip);
        return false;
    }

    //组件信息
    var cateInlist = cate+2;
    var baseIndex  = currentObj.index('.'+extraclass)+1;
    var tempNumObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cateInlist);
    var num        = parseInt(tempNumObj.html(), 10);

    if (num >= arrVerify[cate]) {
        tipspop(dragTitle+'在'+dropTitle+'中已達到最大配置數量');
        return false;
    }

    //互斥关系
    var arrMutexConfig = {
        '3' : '10_延伸柜双抽屉-11_延伸柜单抽屉',
        '7' : '9_延伸柜隔板-10_延伸柜双抽屉-11_延伸柜单抽屉',
        '9' : '7_延伸柜拉板-10_延伸柜双抽屉-11_延伸柜单抽屉',
        '10' : '3_延伸1门板-7_延伸柜拉板-9_延伸柜隔板-11_延伸柜单抽屉',
        '11' : '3_延伸1门板-7_延伸柜拉板-9_延伸柜隔板-10_延伸柜双抽屉',

        '0' : '6_双抽屉',
        '6' : '0_1門板-8_隔板',
        '8' : '6_双抽屉',
    };

    if (arrMutexConfig[cate]) {
        var arrMutex	= arrMutexConfig[cate].split('-');
        for (i in arrMutex) {
            var temp		 = arrMutex[i].split('_');
            var mutex		 = parseInt(temp[0], 10);
            var mutexIndex   = mutex+2;
            var tempMutexObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(mutexIndex);
            var mutexnum     = parseInt(tempMutexObj.html(), 10);
            if (mutexnum > 0) {
                tipspop('您已選擇'+temp[1]);
                return false;
            }
        }
    }

    //更新组件信息
    num++;
    tempNumObj.html(num);

    //显示组件
    if (currentObj.find('.com'+comgroup+'-'+cate+'-'+num).is(":hidden")) {
        num = num;
    } else {
        for (var i=0;i<arrVerify[cate];i++) {
            if (currentObj.find('.com'+comgroup+'-'+cate+'-'+i).is(":hidden")) {
                num = i;
                break;
            }
        }
    }

    //选择颜色
    var color   = parseInt($('input[name=color]:checked').val(),10);

    var showObj = currentObj.find('.com'+comgroup+'-'+cate+'-'+num);
    showObj.find('img').hide();
    showObj.find('img').eq(color).show();
    showObj.show();

    //计算总价
    totalPrice();

    return true;

}

//删除组件
function delcom(obj, comgroup, cate, rely) {

	comgroup = parseInt(comgroup, 10);

    var detaillist = "detailList0";
    var extraclass = "zu0";
    var comnum	   = 12;

	var parentObj = obj.parent();
	var grandObj  = parentObj.parent();
	parentObj.hide();

	//组件数目减一
	cate = parseInt(cate, 10);
	var cateInlist = cate+2;
	var baseIndex  = grandObj.index('.'+extraclass)+1;
	var tempNumObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cateInlist);
	var num = parseInt(tempNumObj.html(), 10)-1;
	num     = num > 0 ? num : 0;
	tempNumObj.html(num);

    //计算总价
    totalPrice();
}

//计算总价
function totalPrice() {
    var	arrComgroupWhitePriceConfig  = {
		'0': 1350,
		'1': 2800,
		'2': 1200,
		'3': 3600,
		'4': 2400
	};
    var	arrComgroupBlackPriceConfig  = {
		'0': 1350,
		'1': 2800,
		'2': 1200,
		'3': 3600,
		'4': 2400
	};
    var	arrComgroupPackagePriceConfig  = {
		'0': 400,
		'1': 640,
		'2': 800,
		'3': 1280,
		'4': 1280
	};
	var	arrComPriceConfig  = {
		'0': 800,
		'1': 300,
		'2': 100,
		'3': 180,
		'4': 500,
		'5': 600,
		'6': 1500,
		'7': 3100,
		'8': 4900,
		'9': 500,
		'10': 2000,
		'11': 200,
		'12': 350,
		'13': 700,
		'14': 1750,
		'15': 1750,
		'16': 600
	};
    var	arrComPackagePriceConfig  = {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 100,
        '5': 0,
        '6': 0,
        '7': 200,
        '8': 400,
        '9': 0,
        '10': 200,
        '11': 0,
        '12': 0,
        '13': 100,
        '14': 100,
        '15': 100,
        '16': 0
    };
    var	arrComDifferencePriceConfig  = {
        '0': 500,
        '1': 50,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0,
        '6': 1100,
        '7': 1700,
        '8': 2300,
        '9': 200,
        '10': 1000,
        '11': 0,
        '12': 0,
        '13': 0,
        '14': 0,
        '15': 0,
        '16': 0
    };

    var list0Cnt     = $('#detailList0 tr').length-1;
    var whitePrice   = 0;
    var blackPrice   = 0;
    var packagePrice = 0;//组装费
    var differencePrice  = 0;//差额
    var comgroup         = 0;
    if (list0Cnt > 0) {
        for (var i=1;i<=list0Cnt;i++) {
            comgroup = parseInt($('#detailList0 tr').eq(i).find('.comgroup').val(), 10);
            whitePrice   += arrComgroupWhitePriceConfig[comgroup];
            blackPrice   += arrComgroupBlackPriceConfig[comgroup];
            packagePrice += arrComgroupPackagePriceConfig[comgroup];
            $('#detailList0 tr').eq(i).find('td').each(function(j){
                if (j >= 2) {
                    tempCate    	 = j-2;
                    tempNum     	 = parseInt($(this).html(), 10);
                    whitePrice      += tempNum*arrComPriceConfig[tempCate];
                    blackPrice      += tempNum*arrComPriceConfig[tempCate];
                    packagePrice    += tempNum*arrComPackagePriceConfig[tempCate];
                    differencePrice += tempNum*arrComDifferencePriceConfig[tempCate];
                }
            });
        }
    }

    whitePrice = formatCurrency(whitePrice);
    blackPrice = formatCurrency(blackPrice);
	packagePrice = formatCurrency(packagePrice);

    $('#price_white').html('NT$'+whitePrice);
    $('#price_black').html('NT$'+blackPrice);
    $('#price_package').html('NT$'+packagePrice);
    $('#price_difference').html('NT$'+formatCurrency(differencePrice));
    $('#price_difference_multiple').html('NT$'+formatCurrency(differencePrice*1.2));
}

//价格规范化
function formatCurrency(num) {
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num);
}