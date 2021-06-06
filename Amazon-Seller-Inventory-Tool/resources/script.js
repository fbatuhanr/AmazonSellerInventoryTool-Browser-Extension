$(document).ready(function(){

	var interval = null;

	var invervalPageCounter = 1;
	var totalPageCount = parseInt($(".mt-foot .mt-foot-skiptopage span.mt-totalpagecount").text().replace( /[^\d.]/g, '' ));
	var totalProductsCount = parseInt($("#myitable .mt-header .mt-header-count #mt-header-pagination-count-unbounded #mt-header-count-value").text());

	var showingProductsCount = parseInt($(".mt-foot .mt-foot-rpp .mt-records-per-page span.a-button-inner span.a-button-text span.a-dropdown-prompt").text().replace( /[^\d.]/g, '' ));;

	function IntervalFunc() {

		if ( invervalPageCounter == totalPageCount)
		{
			showingProductsCount = showingProductsCount - (totalPageCount * showingProductsCount - totalProductsCount);
		}

		var rowCount = $("#myitable .mt-content .mt-table-container table.mt-table tbody").children("tr.mt-row").length;

    	if( rowCount == showingProductsCount) {

    		if( $("#myitable .mt-content .mt-table-container table.mt-table tbody").children("tr.mt-row").eq(rowCount-1).find("td[data-column='buybox_price'] div[data-column='buybox_price'] div.mt-loading.mt-delay-loading").length == 0 ) {

				IntervalComplete();

	    		clearInterval(interval);
    		}
    	}
	}

	function IntervalComplete()	{

		SelectNoLowest();

		var selectedProdCount = parseInt($("#myitable .mt-header .mt-header-bulk-action span.a-button-inner span.a-dropdown-prompt").text().replace( /[^\d.]/g, '' ));

		if( selectedProdCount < 250 ){

			if(invervalPageCounter <= totalPageCount){
				setTimeout( function() { 

					$(".mt-foot .mt-foot-skiptopage input#myitable-gotopage").val(++invervalPageCounter);
					$(".mt-foot .mt-foot-skiptopage span#myitable-gotopage-button input[type=submit]").click();
					
					setTimeout( function() { 
						interval = setInterval(IntervalFunc, 1500);
					}, 2000);	

				}, 800);
			}
			else {
				alert("Tamamlandı, Tüm Lowest Olmayanlar Seçildi!");
			}
		}
		else {
			alert("Seçilen Ürün Sayısı 250'ye Ulaştı! Seçilenleri Silip Tekrar Çalıştırın!")			
		}
	}

	function SelectNoLowest()
	{
		var count = $('#myitable .mt-content table tr.mt-row').length;
			$('#myitable .mt-content table tr.mt-row').each(function(index, elem){
				
				var lowest_txt = $(this).find("td[data-column='lowPrice'] div[data-column='lowPrice-match-link']").text().trim();

				var currPrice_txt = $(this).find("td[data-column='price'] div.mt-icon-field.mt-editable-text.mt-table-main input.a-input-text.main-entry.mt-icon-input.mt-input-text").val();
				var currPrice_val = parseFloat(currPrice_txt).toFixed(2);

				var buyboxPrice_val = parseFloat($(this).find("td[data-column='buybox_price'] div[data-column='buybox_price']").text().replace( /[^\d.]/g, '' ), 10);
				var buyboxShippingPrice_val = parseFloat($(this).find("td[data-column='buybox_price'] div[data-column='buybox_shipping']").text().replace( /[^\d.]/g, '' ), 10);
				var buyboxtotal_val = (buyboxPrice_val + buyboxShippingPrice_val).toFixed(2);


				if (lowest_txt != 'Lowest' && currPrice_val != buyboxtotal_val) {
					$(this).find("td[data-column='select'] input").prop('checked', true);
				}

				if (index === (count - 1)) {
					$(this).find("td[data-column='select'] input").click();
					var delayElem = $(this).find("td[data-column='select'] input");
					setTimeout(function() { delayElem.click(); }, 400);
				}
			});
	}
	


	var isActive = '<div id="pluginActive"><label class="radipasif"><input type="radio" name="aktifmi" id="pasifinki" value="0" checked>FBR <span>Pasif</span></label><label class="radiaktif"><input type="radio" name="aktifmi" value="1">FBR <span>Aktif</span></label></div>';
	$('body').prepend(isActive);

	var fbrstoreHtml = '<div id="fbrstore_2" style="display:none;"><button class="fbrbtn nolowestauto">Lowest Olmayanlar(Oto. Gezin)</button><button class="fbrbtn nolowest">Lowest Olmayanlar</button><button class="fbrbtn nosalesrank">Sales Rank\'i Olmayanlar</button><button class="fbrbtn nolowestsalesrank">Lowest Olmayan ve Sales Rank\'i Olmayanlar</button><button class="fbrbtn nolowestwithoutbuybox">No Lowest (without BuyBox)</button></div>';
	$('#myitable .mt-header .mt-header-filters').before(fbrstoreHtml);


	function hidePluginOpts(){
		$('#fbrstore_2').hide();
	}
	function showPluginOpts(){
		$('#fbrstore_2').show();
	}

	$('#pluginActive input[type=radio][name=aktifmi]').change(function() {
		
		if( this.value == '0' )
		{
			hidePluginOpts();
		}
		else if ( this.value == '1' )
		{
			showPluginOpts();

			$(document).on('click', "#fbrstore_2 button.nosalesrank", function(){

				var count = $('#myitable .mt-content table tr.mt-row').length;
				$('#myitable .mt-content table tr.mt-row').each(function(index, elem){
					
					var salesRank_txt = $(this).find("td[data-column='sales_rank'] div[data-column='sales_rank']").text().trim();
					if (salesRank_txt == '-') {						
						$(this).find("td[data-column='select'] input").prop('checked', true);
					}

					if (index === (count - 1)) {
						$(this).find("td[data-column='select'] input").click();
						var delayElem = $(this).find("td[data-column='select'] input");
						setTimeout(function() { delayElem.click(); }, 500);
					}
				});
			});

			$(document).on('click', "#fbrstore_2 button.nolowestauto", function(){

				interval = setInterval(IntervalFunc, 1500);
			});

			$(document).on('click', "#fbrstore_2 button.nolowest", function(){

				SelectNoLowest();
			});

			$(document).on('click', "#fbrstore_2 button.nolowestsalesrank", function(){

				var count = $('#myitable .mt-content table tr.mt-row').length;
				$('#myitable .mt-content table tr.mt-row').each(function(index, elem){
					
					var salesRank_txt = $(this).find("td[data-column='sales_rank'] div[data-column='sales_rank']").text().trim();
					var lowest_txt = $(this).find("td[data-column='lowPrice'] div[data-column='lowPrice-match-link']").text().trim();

					var currPrice_txt = $(this).find("td[data-column='price'] div.mt-icon-field.mt-editable-text.mt-table-main input.a-input-text.main-entry.mt-icon-input.mt-input-text").val();
					var currPrice_val = parseFloat(currPrice_txt).toFixed(2);

					var buyboxPrice_val = parseFloat($(this).find("td[data-column='buybox_price'] div[data-column='buybox_price']").text().replace( /[^\d.]/g, '' ), 10);
					var buyboxShippingPrice_val = parseFloat($(this).find("td[data-column='buybox_price'] div[data-column='buybox_shipping']").text().replace( /[^\d.]/g, '' ), 10);
					var buyboxtotal_val = (buyboxPrice_val + buyboxShippingPrice_val).toFixed(2);

					if (salesRank_txt == '-' && lowest_txt != 'Lowest' && currPrice_val != buyboxtotal_val) {
						$(this).find("td[data-column='select'] input").prop('checked', true);
					}

					if (index === (count - 1)) {
						$(this).find("td[data-column='select'] input").click();
						var delayElem = $(this).find("td[data-column='select'] input");
						setTimeout(function() { delayElem.click(); }, 500);
					}
				});
			});




			$(document).on('click', "#fbrstore_2 button.nolowestwithoutbuybox", function(){

				var count = $('#myitable .mt-content table tr.mt-row').length;
				$('#myitable .mt-content table tr.mt-row').each(function(index, elem){
					
					var lowest_txt = $(this).find("td[data-column='lowPrice'] div[data-column='lowPrice-match-link']").text().trim();

					if (lowest_txt != 'Lowest') {
						$(this).find("td[data-column='select'] input").prop('checked', true);
					}

					if (index === (count - 1)) {
						$(this).find("td[data-column='select'] input").click();
						var delayElem = $(this).find("td[data-column='select'] input");
						setTimeout(function() { delayElem.click(); }, 500);
					}
				});
			});
		}
	});

	$(window).scroll(function(){

		if( $('#mt-floating-bar').is(':hidden') ){
			
			$('#pluginActive').css('z-index', '100');
			$('#pluginActive').css('top', '50px');
		}
		else {
			
			$('#pluginActive').css('z-index', '201');
			$('#pluginActive').css('top', '10px');
		}
	});

});