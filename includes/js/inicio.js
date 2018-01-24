/*jshint browser:true */
/* eslint-env browser */
/*global Uint8Array, console */
/*global XLSX */
/* eslint no-use-before-define:0 */
var X = XLSX;
var XW = {
	/* worker message */
	msg: 'xlsx',
	/* worker scripts */
	worker: './xlsxworker.js'
};

var global_wb;
var colunTitulo = ['G','H','I','J','K','L'];
var colunDetalhe = ['M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ',
					'AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ',
					'BA','BB','BC','BD','BE','BF','BG','BH','BI','BJ','BK','BL','BM','BN','BO','BP','BQ','BS','BT','BU','BV','BW','BX','BY','BZ',
					'CA','CB','CC','CD','CE','CF','CG','CH','CI','CJ','CK','CL','CM','CN','CO','CP','CQ','CR','CS','CT','CU','CV','CW','CX','CY','CZ',
					'DA','DB','DC','DD','DE','DF','DG','DH','DI','DJ','DK','DL','DM','DN','DO','DP','DQ','DS','DT','DU','DV','DW','DX','DY','DZ',
					'EA','EB','EC','ED','EE','EF','EG'];

var process_wb = (function() {
	var HTMLOUT = document.getElementById('corpo');

	var to_html = function to_html(workbook) {
		HTMLOUT.innerHTML = "";

		var htmlstr = "";

		for(var i = 2; true; i++){
			if(!workbook.Sheets.Sheet1['A'+i]){
				break;
			}

			htmlstr += "<tr id=A"+i+">"
			for(var y = 0; y < colunTitulo.length; y++){
				if(workbook.Sheets.Sheet1[colunTitulo[y]+i]){
					htmlstr += "<td>"+(workbook.Sheets.Sheet1[colunTitulo[y]+i].v)+"</td>";
				} else{
					htmlstr += "<td></td>";
				}
			}

			htmlstr += "</td>";

			htmlstr += "<td><button type='submit' class='btn btn-success btn-sm' data-toggle='modal' data-target='#myModal' onclick=\"detalhar('"+(workbook.Sheets.Sheet1['A'+i].v)+"')\">Detalhar</button></td>";

			htmlstr += "<td>";
			htmlstr += "<div style='display: none' id='detalhe"+(workbook.Sheets.Sheet1['G'+i].v)+"'>";
			htmlstr += "<table class='table table-striped mt-40'>";
			htmlstr += "<thead>";
			htmlstr += "<tr>";
			htmlstr += "<th>Campo</th>";
			htmlstr += "<th>De</th>";
			htmlstr += "<th>Para</th>";
			htmlstr += "</tr>";
			htmlstr += "</thead>";
			htmlstr += "<tbody>";			

			for(var k = 0; k < colunDetalhe.length; k=k+3){
				if(global_wb.Sheets.Sheet1[colunDetalhe[k]+i] && global_wb.Sheets.Sheet1[colunDetalhe[k+1]+i] && String(global_wb.Sheets.Sheet1[colunDetalhe[k]+i].v).trim() != String(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+i].v).trim()){
					htmlstr += "<tr style='background: #FFAAAA'>";
				} else {
					htmlstr += "<tr>";
				}

				if(global_wb.Sheets.Sheet1[colunDetalhe[k]+1]){
					htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v)+"</td>";
				} else{
					htmlstr += "<td></td>";
				}

				if(global_wb.Sheets.Sheet1[colunDetalhe[k]+i]){
					htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+i].v)+"</td>";
				} else{
					htmlstr += "<td></td>";
				}

				if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+i]){
					htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+i].v)+"</td>";
				} else{
					htmlstr += "<td></td>";
				}

				htmlstr += "</tr>";
			}
			
			htmlstr += "</tbody>";
			htmlstr += "</table>";
			htmlstr += "</div>";
			htmlstr += "</td>";

			htmlstr += "</tr>"
		}

		HTMLOUT.innerHTML = htmlstr;
	}
	
	return function process_wb(wb) {
		global_wb = wb;
		to_html(wb);
	};
})();

function do_file(files) {
	var f = files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		var data = e.target.result;
		process_wb(X.read(data, {type: 'array'}));
	};

	reader.readAsArrayBuffer(f);
};

function buscar() {
	var key = _.findKey(global_wb.Sheets.Sheet1, {
		v: $('#ZZGUID').val()
	});

	if(key){
		$('#corpo > tr').hide();
		$("#"+key).show();
	} else {
		$('#corpo > tr').show();
	}
};

function limpar() {
	$('#corpo > tr').show();
	$('#ZZGUID').val("");
};

(function() {
	var xlf = document.getElementById('xlf');
	if(!xlf.addEventListener) return;
	function handleFile(e) {do_file(e.target.files);}
	xlf.addEventListener('change', handleFile, false);
})();
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-36810333-1']);
	_gaq.push(['_trackPageview']);
	(function() {
		var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
		ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
		var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();

function detalhar(val){
	$('#tituloModal').html('Origem X Destino - ' + val);

	var HTMLOUT = document.getElementById('corpoDet');
	HTMLOUT.innerHTML = "";

	var objects = [];
	var htmlstr = $('#detalhe'+val).html();

	HTMLOUT.innerHTML = htmlstr;
}

$('#myModal').on('hide.bs.modal', function () {
    $('.modal-body').scrollTop(0);
});