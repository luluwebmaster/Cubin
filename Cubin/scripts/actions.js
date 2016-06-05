$(document).on("contextmenu", ".g-frame, gf-pixel", function(e){
   return false;
});
window.onload = function() {
    var fileInput = document.getElementById('gp-import');
    fileInput.addEventListener('change', function(e) {
		var file = fileInput.files[0];
		var textType = /text.*/;
		if(file.type.match(textType))
		{
			var reader = new FileReader();
			reader.onload = function(e)
			{
				importValue = reader.result;
			}
			
			reader.readAsText(file);  
		}
		else
		{
			alert('Votre fichier doit être un fichier texte.');
		}
    });
}
$(document).ready(function (){
	if(lcGet('liste_name') !== null && typeof JSON.parse(lcGet('liste_name')) === 'object' && JSON.parse(lcGet('liste_name'))[0] !== undefined)
	{
		liste = JSON.parse(lcGet('liste_name'));
		imageSelected = liste[elementSelect]['images'][frameSelected];
		nbPixelX = liste[elementSelect]['nbPixelX'];
		ralImage = liste[elementSelect]['ralImage'];
		$('.gp-speed input').val(ralImage);
	}
	//On set la frame
	drawPiwel();
	//On masque certain element si besoin
	setInterval(function (){
		if(lcGet('liste_name') !== null && typeof JSON.parse(lcGet('liste_name')) === 'object' && JSON.parse(lcGet('liste_name'))[0] !== undefined)
		{
			$('.gp-button').css('display', 'inline-block');
		}
		else
		{
			$('.gp-button').css('display', 'none');
			clearImg();
		}
	}, 500);
	setListe();
	//On dessine
	$('.g-frame').mouseover(function (e){
		if(clicGauche == true && $(e.target).attr('class') == 'gf-pixel')
		{
			$(e.target).css('background-color', colorPaint);
			if(bigSelecteur == true)
			{
				var posX = $(e.target).position().left;
				var posY = ($(e.target).position().top - $('body').scrollTop());
				//Pixel top
				var topPixel = $.elementFromPoint((posX + ($(e.target).height() / 2)), (posY - ($(e.target).width() / 2)));
				if($(topPixel).attr('class') == "gf-pixel")
				{
					$(topPixel).css('background-color', colorPaint);
				}
				//Pixel bottom
				var bottomPixel = $.elementFromPoint((posX + ($(e.target).height() / 2)), (posY + (($(e.target).width() / 2) + $(e.target).width())));
				if($(bottomPixel).attr('class') == "gf-pixel")
				{
					$(bottomPixel).css('background-color', colorPaint);
				}
				//Pixel left
				var leftPixel = $.elementFromPoint((posX - ($(e.target).height() / 2)), (posY + ($(e.target).width() / 2)));
				if($(leftPixel).attr('class') == "gf-pixel")
				{
					$(leftPixel).css('background-color', colorPaint);
				}
				//Pixel right
				var rightPixel = $.elementFromPoint((posX + (($(e.target).height() / 2)) + $(e.target).height()), (posY + ($(e.target).width() / 2)));
				if($(rightPixel).attr('class') == "gf-pixel")
				{
					$(rightPixel).css('background-color', colorPaint);
				}
			}
		}
	});
	//Quand on clic
	$(document).mousedown(function(e) {
		if($(e.target).attr('class') == 'gf-pixel')
		{
			if(lcGet('liste_name') !== null && typeof JSON.parse(lcGet('liste_name')) === 'object' && JSON.parse(lcGet('liste_name'))[0] !== undefined)
			{
				clicGauche = true;
				$(e.target).css('background-color', colorPaint);
				if(bigSelecteur == true)
				{
					var posX = $(e.target).position().left;
					var posY = ($(e.target).position().top - $('body').scrollTop());
					//Pixel top
					var topPixel = $.elementFromPoint((posX + ($(e.target).height() / 2)), (posY - ($(e.target).width() / 2)));
					if($(topPixel).attr('class') == "gf-pixel")
					{
						$(topPixel).css('background-color', colorPaint);
					}
					//Pixel bottom
					var bottomPixel = $.elementFromPoint((posX + ($(e.target).height() / 2)), (posY + (($(e.target).width() / 2) + $(e.target).width())));
					if($(bottomPixel).attr('class') == "gf-pixel")
					{
						$(bottomPixel).css('background-color', colorPaint);
					}
					//Pixel left
					var leftPixel = $.elementFromPoint((posX - ($(e.target).height() / 2)), (posY + ($(e.target).width() / 2)));
					if($(leftPixel).attr('class') == "gf-pixel")
					{
						$(leftPixel).css('background-color', colorPaint);
					}
					//Pixel right
					var rightPixel = $.elementFromPoint((posX + (($(e.target).height() / 2)) + $(e.target).height()), (posY + ($(e.target).width() / 2)));
					if($(rightPixel).attr('class') == "gf-pixel")
					{
						$(rightPixel).css('background-color', colorPaint);
					}
				}
			}
			else
			{
				alert('Vous devez dans un premier temps ajouter un nouvel element.');
			}
		}
	}).mouseup(function() {
		clicGauche = false;
	});
	//Selection de la couleur
	$('.gp-color').ColorPicker({flat: true});
	var clockColorSelect = setInterval(function (){
		colorPaint = '#'+$('.colorpicker_hex input').val();
	}, 1000);
	//Séléction du speed
	$('.gp-speed input').change(function (){
		ralImage = $(this).val();
		liste = JSON.parse(lcGet('liste_name'));
		liste[elementSelect]['ralImage'] = ralImage;
		liste = JSON.stringify(liste);
		lcAdd('liste_name', liste);
	});
	//Séléction d'un element
	$('.gp-select').change(function (){
		elementSelect = $(this).val();
		frameSelected = 0;
		liste = JSON.parse(lcGet('liste_name'));
		imageSelected = liste[elementSelect]['images'][frameSelected];
		nbPixelX = liste[elementSelect]['nbPixelX'];
		ralImage = liste[elementSelect]['ralImage'];
		$('.gp-speed input').val(ralImage);
		drawPiwel();
		if(typeof imageSelected === 'object')
		{
			loadImg(imageSelected);
		}
		startImage = 0;
		setFrameListe();
	});
	//Séléction d'une frame
	$('.gp-frame').change(function (){
		frameSelected = $(this).val();
		liste = JSON.parse(lcGet('liste_name'));
		imageSelected = liste[elementSelect]['images'][frameSelected];
		loadImg(imageSelected);
	});
	//On écoute les touches
	//Quand on appuie sur une touche
	$('body').keydown(function (e){
		actionUpKey(e.keyCode);
	});
	//Quand on appuie plus sur une touche
	$('body').keyup(function (e){
		actionDownKey(e.keyCode);
	});
});