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

var global_wb = {Sheets:{Sheet1:{}}};
var pagina = 1;
var totalPagina = 0;
var colunTitulo = ['G','I','J','K'];
var colunDetalhe = ['S','T','U','AB','AC','AD','AH','AI','AJ','AN','AO','AP','AQ','AR','AS','CK','CL','CM',
					'DV', 'DW', 'DX'];


var process_wb = (function() {
	return function process_wb(wb) {
		global_wb = {Sheets:{Sheet1:{}}};
		
		var key = JSON.stringify(wb.Sheets.Sheet1).match(/\"([A]{1})\d+/g,'');

		
		for(var i = 1; i < key.length; i++){
			
			if(!wb.Sheets.Sheet1['A'+i]){
				break;
			}
			
			//somente considerar CSIT_REG_MOVTO_SAP_PARCEIRO 5 e 6
			if(i != 1 && wb.Sheets.Sheet1['F'+i]){
				if(wb.Sheets.Sheet1['F'+i].v != 5 && wb.Sheets.Sheet1['F'+i].v != 6){
					continue;
				}
			}

			if(i != 1 && wb.Sheets.Sheet1['U'+i].v == 1 && wb.Sheets.Sheet1['AD'+i].v == 1 && wb.Sheets.Sheet1['AJ'+i].v == 1 && wb.Sheets.Sheet1['AP'+i].v == 1 && wb.Sheets.Sheet1['AS'+i].v == 1 && wb.Sheets.Sheet1['CM'+i].v == 1){
				continue;
			} else{
				for(var t in colunTitulo){
					global_wb.Sheets.Sheet1[colunTitulo[t]+i] = wb.Sheets.Sheet1[colunTitulo[t]+i];
				}
				
				for(var y in colunDetalhe){
					global_wb.Sheets.Sheet1[colunDetalhe[y]+i] = wb.Sheets.Sheet1[colunDetalhe[y]+i];
				}
			}	
			
		}		
		
		to_html();
	};
})();

function to_html(paginacao = false) {
	try{ 

		var HTMLOUT = document.getElementById('corpo');

		HTMLOUT.innerHTML = "";
		var htmlstr = "";

		var key = JSON.stringify(global_wb.Sheets.Sheet1).match(/\"([G]{1})\d+/g,'');
//		var restoDivisao = (key.length - 1) % 100;
//		totalPagina = parseInt(Number((key.length - 1) / 100));
//
//		if(restoDivisao > 0 && totalPagina > 0){
//			totalPagina = Number(totalPagina) + 1;
//		}
//
//		var limite = 0;	
//		if(key.length - 1 > 100){
//			limite = (100 * pagina);
//		}else{
//			limite = key.length - 1;
//		}
//
		var inic = 1;
//		if(limite > 100){
//			inic = limite - 100; 
//		}

		for(var i = inic; i <= key.length; i++){		
			
			if(!key[i] || !global_wb.Sheets.Sheet1['G'+key[i].replace(/[^0-9]/g,'')]){
				break;
			}
			
			if($("#detalhe"+global_wb.Sheets.Sheet1['G'+key[i].replace(/[^0-9]/g,'')].v).length > 0){
				
				htmlstr += "<tr>";
				
				if(global_wb.Sheets.Sheet1['AO'+key[i].replace(/[^0-9]/g,'')]){
					htmlstr += "<th>" + "Opção Comercial: " +  global_wb.Sheets.Sheet1['AO'+key[i].replace(/[^0-9]/g,'')].v + "</th>";
				} else{
					htmlstr += "<th> </th>";
				}
				
				if(global_wb.Sheets.Sheet1['AC'+key[i].replace(/[^0-9]/g,'')]){
					htmlstr += "<th>" + "Complemento de Opção Comercial: " +  global_wb.Sheets.Sheet1['AC'+key[i].replace(/[^0-9]/g,'')].v + "</th>";
				} else{
					htmlstr += "<th> </th>";
				}
				
				htmlstr += "</tr>";
				
				for(var k = 0; k < colunDetalhe.length; k=k+3){
					
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM2_parceiro" || global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM1_parceiro"){
						continue;
					}

					if((global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')] && global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')] && 
							String(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].v).trim() != String(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].v).trim()) || 
							global_wb.Sheets.Sheet1[colunDetalhe[k+2]+key[i].replace(/[^0-9]/g,'')].v == 0){
						htmlstr += "<tr style='background: #FFAAAA'>";						
					} else {
						htmlstr += "<tr>";
					}

					if(global_wb.Sheets.Sheet1[colunDetalhe[k]+1]){
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAEX_apolice"){
							htmlstr += "<td> CIA EXTERNA </td>";
						}					
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAIN_apolice"){
							htmlstr += "<td> CIA INTERNA </td>";
						}
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMINT_parceiro"){
							htmlstr += "<td> RAMO </td>";
						}
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZNAPOL_apolice"){
							htmlstr += "<td> APÓLICE </td>";
						}
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMCAL_parceiro"){
							htmlstr += "<td> VALOR COMISSÃO </td>";
						}
						
					} else{
						htmlstr += "<td></td>";
					}
					
					if(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')]){
						if((global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].w)){
							htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].w)+"</td>";
						} else {
							htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].v)+"</td>";
						}
					} else{
						htmlstr += "<td></td>";
					}

					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')]){
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].w){
							htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].w)+"</td>";
						} else {
							htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].v)+"</td>";
						}
					} else{
						htmlstr += "<td></td>";
					}

					htmlstr += "</tr>";
				}
				
				$("#detalhe"+global_wb.Sheets.Sheet1['G'+key[i].replace(/[^0-9]/g,'')].v + " > table > tbody").append(htmlstr);
				
				htmlstr = "";
				
				continue;
			}
			
			htmlstr += "<tr>";
			
			for(var y = 0; y < colunTitulo.length; y++){
				if(global_wb.Sheets.Sheet1[colunTitulo[y]+key[i].replace(/[^0-9]/g,'')]){
					if(global_wb.Sheets.Sheet1[colunTitulo[y]+key[i].replace(/[^0-9]/g,'')].w){
						//Se é a coluna Status Registro
						if(colunTitulo[y]+key[i].replace(/[^0-9]/g,'') == "I"+key[i].replace(/[^0-9]/g,'')){
							var valorStatus = (global_wb.Sheets.Sheet1[colunTitulo[y]+key[i].replace(/[^0-9]/g,'')].w);
							if(valorStatus == 5){
								htmlstr += "<td>5-Sucesso</td>"
							}else{
								htmlstr += "<td>6-Rejeitado SAP</td>"
							}
						}else{
							htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunTitulo[y]+key[i].replace(/[^0-9]/g,'')].w)+"</td>";
						}
						
					} else {
						htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunTitulo[y]+key[i].replace(/[^0-9]/g,'')].v)+"</td>";
					}
				} else{
					htmlstr += "<td></td>";
				}
			}

			htmlstr += "<td><button type='submit' class='btn btn-success btn-sm' data-toggle='modal' data-target='#myModal' onclick=\"detalhar('"+(global_wb.Sheets.Sheet1['G'+key[i].replace(/[^0-9]/g,'')].v)+"')\">Detalhar</button></td>";

			htmlstr += "<td>";
			
			
			htmlstr += "<div style='display: none' id='detalhe"+(global_wb.Sheets.Sheet1['G'+key[i].replace(/[^0-9]/g,'')].v)+"'>";
			htmlstr += "<table class='table table-striped mt-40'>";
			htmlstr += "<thead>";
			htmlstr += "<tr>";
			
			if(global_wb.Sheets.Sheet1['AO'+key[i].replace(/[^0-9]/g,'')]){
				htmlstr += "<th>" + "Opção Comercial: " +  global_wb.Sheets.Sheet1['AO'+key[i].replace(/[^0-9]/g,'')].v + "</th>";
			} else{
				htmlstr += "<th> </th>";
			}
			
			if(global_wb.Sheets.Sheet1['AC'+key[i].replace(/[^0-9]/g,'')]){
				htmlstr += "<th>" + "Complemento de Opção Comercial: " +  global_wb.Sheets.Sheet1['AC'+key[i].replace(/[^0-9]/g,'')].v + "</th>";
			} else{
				htmlstr += "<th> </th>";
			}
			
			htmlstr += "</tr>";
			htmlstr += "<tr>";
			htmlstr += "<th>Campo</th>";
			htmlstr += "<th>De</th>";
			htmlstr += "<th>Para</th>";
			htmlstr += "</tr>";
			htmlstr += "</thead>";
			htmlstr += "<tbody>";			

			for(var k = 0; k < colunDetalhe.length; k=k+3){
				
				if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM2_parceiro" || global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM1_parceiro"){
					continue;
				}

				if((global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')] && global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')] && 
						String(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].v).trim() != String(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].v).trim()) || 
						global_wb.Sheets.Sheet1[colunDetalhe[k+2]+key[i].replace(/[^0-9]/g,'')].v == 0){
					htmlstr += "<tr style='background: #FFAAAA'>";
					
				} else {
					htmlstr += "<tr>";
				}

				if(global_wb.Sheets.Sheet1[colunDetalhe[k]+1]){
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAEX_apolice"){
						htmlstr += "<td> CIA EXTERNA </td>";
					}					
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAIN_apolice"){
						htmlstr += "<td> CIA INTERNA </td>";
					}
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMINT_parceiro"){
						htmlstr += "<td> RAMO </td>";
					}
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZNAPOL_apolice"){
						htmlstr += "<td> APÓLICE </td>";
					}
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMCAL_parceiro"){
						htmlstr += "<td> VALOR COMISSÃO </td>";
					}
					
				} else{
					htmlstr += "<td></td>";
				}

				if(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')]){
					if((global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].w)){
						htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].w)+"</td>";
					} else {
						htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+key[i].replace(/[^0-9]/g,'')].v)+"</td>";
					}
				} else{
					htmlstr += "<td></td>";
				}

				if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')]){
					if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].w){
						htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].w)+"</td>";
					} else {
						htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+key[i].replace(/[^0-9]/g,'')].v)+"</td>";
					}
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
				
			HTMLOUT.innerHTML += htmlstr;
			
			htmlstr = "";
		}	
		
//		if(!paginacao){
//			if(totalPagina > 1){
//				var htmlPag = "<nav aria-label='Page navigation'>";
//				htmlPag += "<ul class='pagination' style='width-max: 950px; overflow-x: scroll'>";
//
//				if(pagina == 1){
//					htmlPag += "<li class='page-item action' id='pag1'><div class='page-link' onclick='paginar(1)'>1</div></li>";
//				} else{
//					htmlPag += "<li class='page-item' id='pag1'><div class='page-link' onclick='paginar(1)'>1</div></li>";
//				}
//
//				for(var i=2;i<=totalPagina;i++){
//					if(pagina == i){
//						htmlPag += "<li class='page-item action' id='pag"+i+"'><div class='page-link' onclick=\"paginar("+i+")\">"+i+"</div></li>";
//					} else {
//						htmlPag += "<li class='page-item' id='pag"+i+"'><div class='page-link' onclick=\"paginar("+i+")\">"+i+"</div></li>";
//					}
//				}
//			
//				htmlPag += "</ul>";
//				htmlPag += "</nav>";
//			
//				$('#paginacao').html(htmlPag);
//			} else{
//				var htmlPag = "<nav aria-label='Page navigation'>";
//				htmlPag += "<ul class='pagination'>";
//			
//				htmlPag += "</ul>";
//				htmlPag += "</nav>";
//			
//				$('#paginacao').html(htmlPag);
//			}
//		}
		
		var htmlPag = "<nav aria-label='Page navigation'>";
		htmlPag += "<ul class='pagination'>";
	
		htmlPag += "</ul>";
		htmlPag += "</nav>";
	
		$('#paginacao').html(htmlPag);

	}catch(err){ 
	} 
}

function limparErro(){
	document.getElementById('ZZGUID').style.borderColor = ""; 
	show('alert', false); 
	show('alert2', false); 
}

function paginar(pag) {
	loader(true); 
	limparErro();
	setTimeout(() => {
		$( "li" ).removeClass( "action" );
		$( "#pag"+pag ).addClass( "action" );
		pagina = pag;
		
		to_html();
		
		loader(false)
	}, 500);

};

function do_file(files) {
	pagina = 1;
	totalPagina = 0;
	
	loader(true);
	
	var f = files[0];
	var reader = new FileReader();

	reader.onload = function(e) {
		var data = e.target.result;
		process_wb(X.read(data, {type: 'array'}));
		loader(false); 
	};

	try{ 
		reader.readAsArrayBuffer(f);
	}catch(err){ 
		loader(false); 
	} 

	limparErro();
};

function buscar() {
	
	if($('#ZZGUID').val() != ''){ 
		limparErro();
		loader(true); 
	} else{
		show('alert', true); 
		document.getElementById('ZZGUID').style.borderColor = "red";
		return;
	}

	setTimeout(() => {
		try{
			var key = [];
			
			var HTMLOUT = document.getElementById('corpo');
			HTMLOUT.innerHTML = "";
			
			var keys = JSON.stringify(global_wb.Sheets.Sheet1).match(/\"([G]{1})\d+/g,'');
			
		    for (var find = 0; find < keys.length; find++) {
		    	if(global_wb.Sheets.Sheet1['G'+keys[find].replace(/[^0-9]/g,'')].v == $('#ZZGUID').val()){
		    		key.push('G'+keys[find].replace(/[^0-9]/g,''));
		    	}
		    }
			
			if(key.length > 0){	
				
				for(var i = 0; i < key.length; i++){			
					
					var y = String(key[i]).replace(/[^\d]+/g,'');
					var htmlstr = "";
					
					if($("#detalhe"+global_wb.Sheets.Sheet1['G'+y].v).length > 0){
						
						htmlstr += "<tr>";
						
						if(global_wb.Sheets.Sheet1['AO'+key[i].replace(/[^0-9]/g,'')]){
							htmlstr += "<th>" + "Opção Comercial: " +  global_wb.Sheets.Sheet1['AO'+y].v + "</th>";
						} else{
							htmlstr += "<th> </th>";
						}
						
						if(global_wb.Sheets.Sheet1['AC'+y]){
							htmlstr += "<th>" + "Complemento de Opção Comercial: " +  global_wb.Sheets.Sheet1['AC'+y].v + "</th>";
						} else{
							htmlstr += "<th> </th>";
						}
						
						htmlstr += "</tr>";
						
						for(var k = 0; k < colunDetalhe.length; k=k+3){
							
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM2_parceiro" || global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM1_parceiro"){
								continue;
							}
	
							if((global_wb.Sheets.Sheet1[colunDetalhe[k]+y] && global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y] && 
									String(global_wb.Sheets.Sheet1[colunDetalhe[k]+y].v).trim() != String(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].v).trim()) || 
									global_wb.Sheets.Sheet1[colunDetalhe[k+2]+y].v == 0){
								htmlstr += "<tr style='background: #FFAAAA'>";
								
							} else {
								htmlstr += "<tr>";
							}
	
							if(global_wb.Sheets.Sheet1[colunDetalhe[k]+1]){
								if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAEX_apolice"){
									htmlstr += "<td> CIA EXTERNA </td>";
								}					
								if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAIN_apolice"){
									htmlstr += "<td> CIA INTERNA </td>";
								}
								if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMINT_parceiro"){
									htmlstr += "<td> RAMO </td>";
								}
								if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZNAPOL_apolice"){
									htmlstr += "<td> APÓLICE </td>";
								}
								if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMCAL_parceiro"){
									htmlstr += "<td> VALOR COMISSÃO </td>";
								}
								
							} else{
								htmlstr += "<td></td>";
							}
	
							if(global_wb.Sheets.Sheet1[colunDetalhe[k]+y]){
								if((global_wb.Sheets.Sheet1[colunDetalhe[k]+y].w)){
									htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+y].w)+"</td>";
								} else {
									htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+y].v)+"</td>";
								}
							} else{
								htmlstr += "<td></td>";
							}
	
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y]){
								if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].w){
									htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].w)+"</td>";
								} else {
									htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].v)+"</td>";
								}
							} else{
								htmlstr += "<td></td>";
							}
	
							htmlstr += "</tr>";
						}
						
						$("#detalhe"+global_wb.Sheets.Sheet1['G'+y].v + " > table > tbody").append(htmlstr);
						
						htmlstr = "";
						
						continue;
					}
					
					htmlstr += "<tr>"
					for(var h = 0; h < colunTitulo.length; h++){
						if(global_wb.Sheets.Sheet1[colunTitulo[h]+y]){
							if(global_wb.Sheets.Sheet1[colunTitulo[h]+y].w){
								htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunTitulo[h]+y].w)+"</td>";
							} else {
								htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunTitulo[h]+y].v)+"</td>";
							}
						} else{
							htmlstr += "<td></td>";
						}
					}
	
					htmlstr += "</td>";
	
					htmlstr += "<td><button type='submit' class='btn btn-success btn-sm' data-toggle='modal' data-target='#myModal' onclick=\"detalhar('"+(global_wb.Sheets.Sheet1['G'+y].v)+"')\">Detalhar</button></td>";
	
					htmlstr += "<td>";
					htmlstr += "<div style='display: none' id='detalhe"+(global_wb.Sheets.Sheet1['G'+y].v)+"'>";
					htmlstr += "<table class='table table-striped mt-40'>";
					htmlstr += "<thead>";
					htmlstr += "<tr>";
					
					if(global_wb.Sheets.Sheet1['AO'+y]){
						htmlstr += "<th>" + "Opção Comercial: " +  global_wb.Sheets.Sheet1['AO'+y].v + "</th>";
					} else{
						htmlstr += "<th> </th>";
					}
					
					if(global_wb.Sheets.Sheet1['AC'+y]){
						htmlstr += "<th>" + "Complemento de Opção Comercial: " +  global_wb.Sheets.Sheet1['AC'+y].v + "</th>";
					} else{
						htmlstr += "<th> </th>";
					}
					
					htmlstr += "</tr>";
					htmlstr += "<tr>";
					htmlstr += "<th>Campo</th>";
					htmlstr += "<th>De</th>";
					htmlstr += "<th>Para</th>";
					htmlstr += "</tr>";
					htmlstr += "</thead>";
					htmlstr += "<tbody>";			
	
					for(var k = 0; k < colunDetalhe.length; k=k+3){
						
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM2_parceiro" || global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZOPCOM1_parceiro"){
							continue;
						}
						
						if((global_wb.Sheets.Sheet1[colunDetalhe[k]+y] && global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y] && 
							String(global_wb.Sheets.Sheet1[colunDetalhe[k]+y].v).trim() != String(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].v).trim()) || 
							global_wb.Sheets.Sheet1[colunDetalhe[k+2]+y].v == 0){
							htmlstr += "<tr style='background: #FFAAAA'>";
						} else {
							htmlstr += "<tr>";
						}
	
						if(global_wb.Sheets.Sheet1[colunDetalhe[k]+1]){
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAEX_apolice"){
								htmlstr += "<td> CIA EXTERNA </td>";
							}
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZCIAIN_apolice"){
								htmlstr += "<td> CIA INTERNA </td>";
							}
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMINT_parceiro"){
								htmlstr += "<td> RAMO </td>";
							}
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZNAPOL_apolice"){
								htmlstr += "<td> APÓLICE </td>";
							}
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+1].v == "ZZRMCAL_parceiro"){
								htmlstr += "<td> VALOR COMISSÃO </td>";
							}
	
						} else{
							htmlstr += "<td></td>";
						}
	
						if(global_wb.Sheets.Sheet1[colunDetalhe[k]+y]){
							if((global_wb.Sheets.Sheet1[colunDetalhe[k]+y].w)){
								htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+y].w)+"</td>";
							} else {
								htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k]+y].v)+"</td>";
							}
						} else{
							htmlstr += "<td></td>";
						}
	
						if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y]){
							if(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].w){
								htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].w)+"</td>";
							} else {
								htmlstr += "<td>"+(global_wb.Sheets.Sheet1[colunDetalhe[k+1]+y].v)+"</td>";
							}
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
					
					HTMLOUT.innerHTML += htmlstr;
					htmlstr = "";
				}
				
				var htmlPag = "<nav aria-label='Page navigation'>";
				htmlPag += "<ul class='pagination'>";
			
				htmlPag += "</ul>";
				htmlPag += "</nav>";
			
				$('#paginacao').html(htmlPag);
				
				
			} else {
				to_html();
				show('alert2', true); 
				document.getElementById('ZZGUID').style.borderColor = "red";
			}
		}catch(err){ 
			loader(false); 
			document.getElementById('ZZGUID').style.borderColor = "red"; 
			show('alert', false); 
			show('alert2', true); 
		} 
		loader(false);
	}, 500);
	
};

function limpar() {
	loader(true);
	setTimeout(() => {
		$('#ZZGUID').val("");
		to_html();
		loader(false)
	}, 500);

	limparErro();
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


function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}


function loader(value){
	if(value){
		$('#loader').show();
		$('#myDiv').css( "opacity", 0.5);
	}else{
		$('#loader').hide();
		$('#myDiv').css( "opacity", 1);
	}
}