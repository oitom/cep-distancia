function mascara(t, mask) {
    var i = t.value.length;
    var saida = mask.substring(1,0);
    var texto = mask.substring(i)

    if (texto.substring(0,1) != saida) {
        t.value += texto.substring(0,1);
    }
}

$('body').on('click', '#calcular', function() {
	var unit = ' km';
	var cep = $("#cep").val();
	cep = cep.replace('.','');
	cep = cep.replace('-','');

	// load json file and loop itens
	//$.getJSON( "locales/endereco.json", function( data ) {
	$.ajax({
	    type: "GET",
	    url: "locales/ceps.json",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    data: {},
	    success: function(data) {
	    	var latitude = '';
			var longitude = '';
			var error = false;

			$.each(data, function(key, item) {
				if(cep == item.cep) {
					latitude = item.latitude;
					longitude = item.longitude;
				}
			});

			var html = `<table>
							<thead>
								<tr>
									<th style='width:100px'>CEP</th>
									<th style='width:440px'>Rua/Av</th>
									<th style='width:140px'>Bairro</th>
									<th style='width:140px'>Cidade</th>
									<th style=''>Distância</th>
								</tr>
							</thead>
							<tbody>`;

			$.each(data, function(key, item) {
				var start = {
					lat: latitude || undefined,
					lng: longitude || undefined
				};

				var end = {
					lat: item.latitude || undefined,
					lng: item.longitude || undefined
				};


				if(geolib.validate(start) && geolib.validate(end)) {
					var distance = geolib.getDistance(start, end);
					
					html += `<tr>
								<td>${item.cep}</td>
								<td>${item.logr_compl}</td>
								<td>${item.bairro}</td>
								<td>${item.localidade}/${item.uf}</td>
								<td>${geolib.convertUnit('km', distance)} km</td>
							</tr>`;						
				}
				else{
					error = true;
					html = `Erro ao calcular.`;
				}
			});

			if(!error)
				html += `</tbody></table>`;

			$('.result').html(html);
		}
	});
});