var	arrComgroupComNumConfig  = {
    '0': 4,
    '1': 3,
    '2': 3,
    '3': 6,
    '4': 4,
    '5': 5
};
var	arrComInDetailList  = {
    '0_0': 0,
    '0_17': 1,
    '0_6': 2,
    '0_8': 3,
    '1_1': 0,
    '1_13': 1,
    '1_8': 2,
    '2_2': 0,
    '2_15': 1,
    '2_8': 2,
    '3_3': 0,
    '3_12': 1,
    '3_9': 2,
    '3_10': 3,
    '3_11': 4,
    '3_19': 5,
    '4_4': 0,
    '4_14': 1,
    '4_9': 2,
    '4_7': 3,
    '5_5': 0,
    '5_16': 1,
    '5_9': 2,
    '5_18': 3,
    '5_7': 4
};
var	arrComCateInDetailList  = {
    '0_0': 0,
    '0_1': 17,
    '0_2': 6,
    '0_3': 8,
    '1_0': 1,
    '1_1': 13,
    '1_2': 8,
    '2_0': 2,
    '2_1': 15,
    '2_2': 8,
    '3_0': 3,
    '3_1': 12,
    '3_2': 9,
    '3_3': 10,
    '3_4': 11,
    '3_5': 19,
    '4_0': 4,
    '4_1': 14,
    '4_2': 9,
    '4_3': 7,
    '5_0': 5,
    '5_1': 16,
    '5_2': 9,
    '5_3': 18,
    '5_4': 7
};
var	arrComgroupMaxConfig  = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0.3,
    '4': 0.7,
    '5': 1
};
var	arrComWeightConfig  = {
    '0': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0.4,
    '8': 0,
    '9': 0.2,
    '10': 0,
    '11': 0,
    '12': 0,
    '13': 0,
    '14': 0,
    '15': 0,
    '16': 0,
    '17': 0,
    '18': 0
};

$(function(){
    $("#dropzone").dblclick(function(e) {
        console.log(e.offsetX,e.offsetY,111111);

        var tempComList = $(this).data().comlist;
        var tempHtml    = '<div class="drop-pop">';
        $('.dragBase').each(function(){
            tempHtml += $(this).html();
        });
        tempHtml += "</div>";
        tempHtml += "<script>";
        tempHtml += "$('.btn-com').click(function(){$(this).addClass('active').siblings().removeClass('active');});";
        tempHtml += "$('.btn-com').dblclick(function(){if (addDrop("+e.offsetX+","+e.offsetY+")) {layer.closeAll();} });";
        tempHtml += "</script>";

        layer.open({
            title: '添加柜体',
            content: tempHtml,
            area : ["550px", "500px"],
            yes: function () {
                if (addDrop(e.offsetX,e.offsetY)) {
                    layer.closeAll();
                }
            }
        });
    })
    $('#dropzone').delegate('.drop-item', 'dblclick', function(e){
        console.log(e.offsetX,e.offsetY,222222);
        return false;
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
        if ($('#'+tempDetaillist+' tbody tr').length == 0) {
            $('#'+tempDetaillist).hide();
        }

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
        var tempHtml    = '<div class="com-pop">';
        var tempComList = tempComList.split('-');
        for (var i in tempComList) {
            var tempComIndex = tempComList[i].split('_');
            tempHtml += $('.dragCom').eq(tempComIndex[0]).html();
        }
        tempHtml += "</div>";
        tempHtml += "<script>";
        tempHtml += "$('.btn-com').click(function(){$(this).addClass('active').siblings().removeClass('active');});";
        tempHtml += "$('.btn-com').dblclick(function(){if (addcom()) {layer.closeAll();} });";
        tempHtml += "</script>";

        layer.open({
            title: '添加配件',
            content: tempHtml,
            area : ["550px", "520px"],
            yes: function () {
                if (addcom()) {
                    layer.closeAll();
                }
            }
        });

    });

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
            tempx  = tempx == 0 ? '&nbsp;' : tempx;
            htmlX += '<span>'+tempx+'</span>';
        }
        index++;
    }
    $('#coor-x').html('').html(htmlX);

    //纵坐标
    var htmlY = '';
    for(var i=9; i>=0; i--) {
        tempy  = i*35.2+10;
        tempy  = parseFloat(tempy.toFixed(1));
        htmlY += i == 0 ? '<span style="height:55px;">'+tempy+'<br/>'+0+'</span>' : '<span style="height:55px;">'+tempy+'</span>';
    }
    $('#coor-y').html('').html(htmlY);

});

//信息提示
function tipspop(text) {
	layer.msg(text);
}

//添加柜体
function addDrop(offsetX,offsetY)
{

    if ($('.btn-com.active').length == 0) {
        tipspop("請選擇櫃體");
        return false;
    }

    var realUnitWidth   = 55;
    var realUnitHeight  = 55;
    var tempObj		    = $('.btn-com.active');//ui.draggable;

    var arrInfo		    = tempObj.attr('rel').split(',');
    var dropTitle       = tempObj.attr('title');

    var width		    = parseInt(arrInfo[1], 10);
    var comgroup        = parseInt(arrInfo[4], 10);
    var height          = parseInt(arrInfo[5], 10);

    var detaillist      = "detailList"+comgroup;
    var extraclass      = "zu"+comgroup;
    var comnum	        = arrComgroupComNumConfig[comgroup];
    var color           = parseInt($('input[name=color]:checked').val(),10);

    //根据颜色选择路径
    arrInfo[0] = color == 0 ?  arrInfo[0].replace('cube','cube-r') : arrInfo[0].replace('cube','cube-b');

    var $el = $('<div class="drop-item '+extraclass+'" style="width:'+width+'px;" rel="'+arrInfo[3]+'" data-detaillist="'+detaillist+'" data-extraclass="'+extraclass+'" data-comgroup="'+comgroup+'" data-droptitle="'+dropTitle+'"><p class="details"><img src="'+arrInfo[0]+'" style="width:'+width+'px;" onselectstart="return false" /></p></div>');

    /*添加菜单部分*/
    $el.append($('<div class="menu-container"><button type="button" class="btn btn-default btn-xs menu"><i class="fa fa-angle-double-down"></i></button><ul><li><a href="javascript:void(0);" class="removeDrop" data-detaillist="'+detaillist+'" data-extraclass="'+extraclass+'">删除</a></li><li><a href="javascript:void(0);" class="addcompage" data-comlist="'+arrInfo[3]+'">添加配件</a></li></ul></div>'));
    /*添加菜单部分 end*/

    //选择容器
    var top 	= offsetY;
    var topMax  = top - top % realUnitHeight +　realUnitHeight;
    top 		= topMax - height;

    var left 	= offsetX;
    left 		= left - left % realUnitWidth;
    left 		= left < 0 ? 0 : left;
    var leftMax = left + width;

    //柜体的边界检查
    if (leftMax > 1200) {
        tipspop('請把櫃體拖入顯示範圍');
        return false;
    }
    if (top < 0) {
        tipspop('請把櫃體拖入顯示範圍');
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
        tipspop('該區域已有櫃體');
        return false;
    }

    $el.css({'top':top+'px','left':left+'px'});
    $('#dropzone').append($el);

    //柜体的位置信息
    $el.attr('shuaiquan',left+','+leftMax+','+top+','+topMax);

    //添加组件(预加载)
    $el.append($('#comgroup'+comgroup).html());

    var addIndex = $el.index('.'+extraclass);
    var index = 1;
    var html  = '';
    html += '<tr>';
    html += '<td>'+index+'<input class="comgroup" value="'+comgroup+'" type="hidden"/></td>';
    for(var i=0;i<6;i++) {
        html += i<comnum ? '<td>0</td>' : '<td></td>';
    }
    html += '</tr>';

    if (addIndex == 0) {
        $('#'+detaillist+' tbody').prepend(html);
        $('#'+detaillist).show();
    } else {
        var prevIndex = addIndex-1;
        $('#'+detaillist+' tbody tr').eq(prevIndex).after(html);
    }
    $('.'+extraclass).each(function(i){
        $('#'+detaillist+' tbody tr').eq(i).find('td').eq(0).html(i+1);
    });

    //计算总价
    totalPrice();

    return true;
}

//添加组件
function addcom()
{
    if ($('.btn-com.active').length == 0) {
        tipspop("請選擇配件");
        return false;
    }

    var currentObj  = $('.drop-item.current');

    var tempObj		= $('.btn-com.active');
    var arrInfo		= tempObj.attr('rel').split(',');
    var dragTitle   = tempObj.attr('title');

    var extraclass  = currentObj.data().extraclass;
    var detaillist  = currentObj.data().detaillist;
    var comgroup    = currentObj.data().comgroup;
    var dropTitle   = currentObj.data().droptitle;

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
    var cateInlist = arrComInDetailList[comgroup+'_'+cate]+1;
    var baseIndex  = currentObj.index('.'+extraclass)+1;
    var tempNumObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cateInlist);
    var num        = parseInt(tempNumObj.html(), 10);

    if (num >= arrVerify[cate]) {
        tipspop(dragTitle+'在'+dropTitle+'中已達到最大配置數量');
        return false;
    }

    //兄弟互斥关系
    var comWeight   = 0;
    var comgroupMax = arrComgroupMaxConfig[comgroup];
    var tempCate    = 0;
    var tempNum     = 0;
    $('#detailList'+comgroup+' tr').eq(baseIndex).find('td').each(function(i){
        if (i >= 1) {
            tempIndex  = i - 1;
            tempCate   = arrComCateInDetailList[comgroup+'_'+tempIndex];
			if (tempCate) {
				tempNum    = parseInt($(this).html(), 10);			
				console.log(tempCate,tempNum);
				tempNum   += cate == tempCate ? 1 : 0;
				comWeight += tempNum*arrComWeightConfig[tempCate];
			}
            
        }
    });
	console.log(comgroupMax,comWeight);
    if (comWeight > comgroupMax) {
        tipspop('配件已超过最大選购數量');
        return false;
    }

    //互斥关系
    var arrMutexConfig = {

        '0_0' : '17_延伸櫃玻璃門板-6_雙抽屜',
        '0_6' : '0_延伸櫃門板-17_延伸櫃玻璃門板-8_層板',
        '0_8' : '6_雙抽屉',
        '0_17' : '0_延伸櫃門板-6_雙抽屉',

        '1_1' : '13_二層櫃玻璃門板',
        '1_13' : '1_二層櫃門板',

        '2_2' : '15_二層櫃玻璃门板',
        '2_15' : '2_二層櫃门板',

        '3_3' : '10_加寬雙抽屜-11_加寬單抽屜-12_加寬延伸櫃玻璃門板-19_加寬一抽',
        '3_9' : '10_加寬雙抽屜-11_加寬單抽屜-19_加寬一抽',
        '3_10' : '3_加寬拉板-9_加寬層板-11_加寬單抽屜-12_加寬延伸櫃玻璃門板-19_加寬一抽',
        '3_11' : '3_加寬延伸櫃門板-9_加寬層板-10_加寬雙抽屜-12_加寬延伸櫃玻璃門板-19_加寬一抽',
        '3_12' : '3_加寬延伸櫃門板-10_加寬雙抽屜-11_加寬單抽屜-19_加寬一抽',
        '3_19' : '3_加寬延伸櫃門板-9_加寬層板-10_加寬雙抽屜-12_加寬延伸櫃玻璃門板',

        '4_4' : '14_加寬二層櫃玻璃門板',
        '4_14' : '4_加寬二層櫃門板',

        '5_5' : '16_加寬三層櫃玻璃門板',
        '5_16' : '5_加寬三層櫃門板',
        '5_7' : '18_吊衣桿',
        '5_9' : '18_吊衣桿',
        '5_18' : '7_加寬拉板-9_加寬層板'

    };

    if (arrMutexConfig[comgroup+'_'+cate]) {
        var arrMutex	= arrMutexConfig[comgroup+'_'+cate].split('-');
        console.log(cate,arrMutex);
        for (i in arrMutex) {
            var temp		 = arrMutex[i].split('_');
            var mutex		 = parseInt(temp[0], 10);
            var mutexIndex   = arrComInDetailList[comgroup+'_'+mutex]+1;
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
function delcom(obj, comgroup, cate, rely)
{

	comgroup = parseInt(comgroup, 10);

    var detaillist = "detailList"+comgroup;
    var extraclass = "zu"+comgroup;

	var parentObj  = obj.parent();
	var grandObj   = parentObj.parent();
	parentObj.hide();

	//组件数目减一
	cate = parseInt(cate, 10);
	// var cateInlist = cate+2;
    var cateInlist = arrComInDetailList[comgroup+'_'+cate]+1;
	var baseIndex  = grandObj.index('.'+extraclass)+1;
	var tempNumObj = $('#'+detaillist+' tr').eq(baseIndex).find('td').eq(cateInlist);
	var num = parseInt(tempNumObj.html(), 10)-1;
	num     = num > 0 ? num : 0;
	tempNumObj.html(num);

    //计算总价
    totalPrice();
}

//计算总价
function totalPrice()
{
    var	arrComgroupWhitePriceConfig  = {
		'0': 750,
		'1': 1200,
		'2': 1650,
		'3': 1200,
		'4': 1800,
		'5': 2400
	};
    var	arrComgroupBlackPriceConfig  = {
		'0': 750,
		'1': 1200,
		'2': 1650,
		'3': 1200,
		'4': 1800,
		'5': 2400
	};
    var	arrComgroupPackagePriceConfig  = {
		'0': 590,
		'1': 590,
		'2': 740,
		'3': 1180,
		'4': 1180,
		'5': 1480,
	};
	var	arrComPriceConfig  = {
		'0': 350,//延伸櫃門板
		'1': 500,//二層櫃門板
		'2': 600,//三層櫃門板
		'3': 700,//加寬延伸櫃門板
		'4': 950,//加寬二層櫃門板
		'5': 1200,//加寬三層櫃門板
		'6': 1800,//双抽屉
		'7': 1050,//延伸櫃拉板
		'8': 250,//層板
		'9': 450,//加寬層板
		'10': 1900,//加寬雙抽屜
		'11': 1550,//加寬單抽屜
		'12': 1000,//加寬延伸櫃玻璃門板
		'13': 700,//二層櫃玻璃門板
		'14': 1400,//加寬二層櫃玻璃門板
		'15': 1100,//三層櫃玻璃門板
		'16': 2200,//加寬三層櫃玻璃門板
		'17': 500,//延伸櫃玻璃門板
		'18': 600,//吊衣杆
		'19': 1550//加寬一抽
	};
    var	arrComPackagePriceConfig  = {
        '0': 0,
		'1': 0,
		'2': 0,
		'3': 0,
		'4': 0,
		'5': 0,
		'6': 300,
		'7': 150,
		'8': 0,
		'9': 0,
		'10': 300,
		'11': 150,
		'12': 0,
		'13': 0,
		'14': 0,
		'15': 0,
		'16': 0,
		'17': 0,
		'18': 0,
		'19':150
    };
    var	arrComDifferencePriceConfig  = {
        		'0': 50,//延伸櫃門板
		'1': 50, //二層櫃門板
		'2': 200,//三層櫃門板
		'3': 100,//加寬延伸櫃門板
		'4': 150,//加寬二層櫃門板
		'5': 400,//加寬三層櫃門板
		'6': 600,//双抽屉
		'7': 0,//延伸櫃拉板
		'8': 0,//層板
		'9': 0,//加寬層板
		'10': 600,//加寬雙抽屜
		'11': 600,//加寬單抽屜
		'12': 200,//加寬延伸櫃玻璃門板
		'13': 150,//二層櫃玻璃門板
		'14': 300,//加寬二層櫃玻璃門板
		'15': 250,//三層櫃玻璃門板
		'16': 500,//加寬三層櫃玻璃門板
		'17': 100,//延伸櫃玻璃門板
		'18': 0,//吊衣杆
		'19': 600//加寬一抽
    };

    var dropCnt             = $('.detailList').length;//柜体的种类
    var whitePrice          = 0;
    var blackPrice          = 0;
    var packagePrice        = 0;//组装费
    var differencePrice     = 0;//差额
    var comgroup            = 0;
    for (var x=0;x<dropCnt;x++) {
        comgroup     = x;
        var thislist = $('#detailList'+comgroup+' tr');
        var listCnt  = thislist.length-1;
        var i        = 1;
        if (listCnt > 0) {
            for (i=1;i<=listCnt;i++) {
                //柜体的价格
                whitePrice   += arrComgroupWhitePriceConfig[comgroup];
                blackPrice   += arrComgroupBlackPriceConfig[comgroup];
                packagePrice += arrComgroupPackagePriceConfig[comgroup];
                //配件的价格
                thislist.eq(i).find('td').each(function(j){
                    if (j >= 1) {
                        tempIndex        = j - 1;
                        tempCate    	 = arrComCateInDetailList[comgroup+'_'+tempIndex];
                        if (tempCate >= 0) {
                            tempNum     	 = parseInt($(this).html(), 10);
                            whitePrice      += tempNum*arrComPriceConfig[tempCate];
                            blackPrice      += tempNum*arrComPriceConfig[tempCate];
                            packagePrice    += tempNum*arrComPackagePriceConfig[tempCate];
                            differencePrice += tempNum*arrComDifferencePriceConfig[tempCate];
                        }
                    }
                });
            }
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
    $('#price_difference_multiple2').html('NT$'+formatCurrency(differencePrice*1.4));
}

//价格规范化
function formatCurrency(num)
{
    num = num.toString().replace(/\$|\,/g,'');
    if(isNaN(num))
        num = "0";
    sign  = (num == (num = Math.abs(num)));
    num   = Math.floor(num*100+0.50000000001);
    cents = num%100;
    num   = Math.floor(num/100).toString();
    if(cents<10)
    cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num   = num.substring(0,num.length-(4*i+3))+','+
    num.substring(num.length-(4*i+3));
    return (((sign)?'':'-') + num);
}