//Fonction pour set des actions sur les touches quand on APPUIE dessus
function actionUpKey(codeKey)
{
	// alert(codeKey)
	//On set les differentes actions à effectuer
	switch(codeKey)
	{
		//Touche pour selectionner le gros selecteur
		case 16:
			bigSelecteur = true;
		break;
	}
}
//Fonction pour set des actions sur les touches quand on APPUIE dessus
function actionDownKey(codeKey)
{
	//On set les differentes actions à effectuer
	switch(codeKey)
	{
		//Touche pour selectionner le gros selecteur
		case 16:
			bigSelecteur = false;
		break;
	}
}
//Fonction pour save une image
function saveImg()
{
	if(editImage == false)
	{
		var start = 1;
		listePixel = {};
		$('.gf-pixel').each(function (){
			listePixel[start] = $(this).css('background-color');
			start++;
		});
		liste = JSON.parse(lcGet('liste_name'));
		listeImages = liste[elementSelect]['images'];
		if(Object.keys(listeImages).length == 0)
		{
			listeImages[Object.keys(listeImages).length] = listePixel;
		}
		else
		{
			listeImages[Object.keys(listeImages).length] = listePixel;
		}
		liste[elementSelect]['images'] = listeImages;
		liste = JSON.stringify(liste);
		lcAdd('liste_name', liste);
		setFrameListe();
	}
	else
	{
		alert('Vous êtes entrain d\'éditer une image, validez votre édition avant d\'effectuer cette action.');
	}
}
//Fonction pour load une image
function loadImg(data)
{
	data = data;
	var start = 1;
	$('.gf-pixel').each(function (){
		$(this).css('background-color', data[start])
		start++;
	});
}
//Fonction pour clear la frame
function clearImg()
{
	$('.gf-pixel').each(function (){
		$(this).css('background-color', "white")
	});
}
//Fonction pour play une liste d'image
function playImage(data)
{
	var start2 = 1;
	var data2 = data[startImage];
	$('.gf-pixel').each(function (){
		$(this).css('background-color', data2[start2])
		start2++;
	});
	startImage++;
	if(startImage == Object.keys(data).length)
	{
		startImage = 0;
	}
}
//Fonction pour ajouter une nouvelle entré
function addElement()
{
	var name = $('.gp-new').val();
	nbPixelX = parseFloat($('.gp-pixels').val());
	if(!Number.isInteger(nbPixelX) || nbPixelX == "" || nbPixelX > 100)
	{
		nbPixelX = 10;
	}
	if(name !== "")
	{
		if(lcGet('liste_name') !== null)
		{
			liste = JSON.parse(lcGet('liste_name'));
			countElement = Object.keys(liste).length;
			liste[countElement] = {
				"name" : name,
				"nbPixelX" : nbPixelX,
				"ralImage" : ralImage,
				"images" : {}
			};
			liste = JSON.stringify(liste);
			lcAdd('liste_name', liste)
			elementSelect = countElement;
		}
		else
		{
			var liste = {
				0 : {
					"name" : name,
					"nbPixelX" : nbPixelX,
					"ralImage" : ralImage,
					"images" : {}
				}
			}
			liste = JSON.stringify(liste);
			lcAdd('liste_name', liste)
		}
		setListe();
		$('.gp-new').val('');
		$('.gp-pixels').val('');
		drawPiwel();
	}
	else if(importValue !== false)
	{
		var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
		if(base64regex.test(importValue))
		{
			importValue = JSON.parse(atob(importValue));
			if(typeof importValue === 'object')
			{
				liste = JSON.parse(lcGet('liste_name'));
				if(liste !== null)
				{
					countElement = Object.keys(liste).length;
				}
				else
				{
					countElement = 0;
					liste = {};
				}
				liste[countElement] = importValue;
				liste = JSON.stringify(liste);
				lcAdd('liste_name', liste)
				elementSelect = countElement;
				setListe();
				$('.gp-import').val('');
				drawPiwel();
			}
			else
			{
				alert('Un erreur est survenue lors du décodage de la chaîne.');	
			}
		}
		else
		{
			alert('Un erreur est survenue lors du décodage de la chaîne.');	
		}
		importValue = false;
	}
	else
	{
		alert('Vous devez entrer un nom !');
	}
}
//Fonction pour supprimer un element
function deleteElement()
{
	if(imagesStarted == false)
	{
		liste = JSON.parse(lcGet('liste_name'));
		delete liste[elementSelect];
		liste = resetOrderObject(liste);
		liste = JSON.stringify(liste);
		lcAdd('liste_name', liste);
		elementSelect = 0;
		setListe();
		setFrameListe();
		liste = JSON.parse(lcGet('liste_name'));
		nbPixelX = liste[elementSelect]['nbPixelX'];
		drawPiwel();
	}
	else
	{
		alert('Vous êtes en mode lecture !');
	}
}
//Fonction pour supprimer une image
function deleteImage()
{
	if(imagesStarted == false)
	{
		liste = JSON.parse(lcGet('liste_name'));
		delete liste[elementSelect]['images'][frameSelected];
		liste[elementSelect]['images'] = resetOrderObject(liste[elementSelect]['images']);
		liste = JSON.stringify(liste);
		lcAdd('liste_name', liste);
		frameSelected = 0;
		setFrameListe();
		clearImg();
	}
	else
	{
		alert('Vous êtes en mode lecture !');
	}
}
//Fonction pour set la liste des elements
function setListe()
{
	if(lcGet('liste_name') !== null && typeof JSON.parse(lcGet('liste_name')) === 'object' && JSON.parse(lcGet('liste_name'))[0] !== undefined)
	{
		$('.gp-select').html('');
		liste = JSON.parse(lcGet('liste_name'));
		lengthListe = Object.keys(liste).length;
		for(i=0;i<lengthListe;i++)
		{
			var selected = "";
			if(i == elementSelect)
			{
				selected = ' selected="selected"';
			}
			$('.gp-select').append('<option value="'+i+'"'+selected+'>'+liste[i]['name']+'</option>');
		}
		setFrameListe();
	}
}
//Fonction pour set la liste frame
function setFrameListe()
{
	if(lcGet('liste_name') !== null && typeof JSON.parse(lcGet('liste_name')) === 'object' && JSON.parse(lcGet('liste_name'))[0] !== undefined)
	{
		$('.gp-frame').html('');
		liste = JSON.parse(lcGet('liste_name'))[elementSelect]['images'];
		lengthListe = Object.keys(liste).length;
		for(i=0;i<lengthListe;i++)
		{
			var selected = "";
			if(i == frameSelected)
			{
				selected = ' selected="selected"';
			}
			$('.gp-frame').append('<option value="'+i+'"'+selected+'>'+i+' - Frame #'+i+'</option>');
		}
	}
}
//Fonction pour édit une frame
function edidtFrame()
{
	if(imagesStarted == false)
	{
		if(editImage == true)
		{
			var start = 1;
			listePixel = {};
			$('.gf-pixel').each(function (){
				listePixel[start] = $(this).css('background-color');
				start++;
			});
			liste = JSON.parse(lcGet('liste_name'));
			listeImages = liste[elementSelect]['images'];
			listeImages[frameSelected] = listePixel;
			liste[elementSelect]['images'] = listeImages;
			liste = JSON.stringify(liste);
			lcAdd('liste_name', liste);
			$('.gpb-edit').html('Edit');
			$('.gpb-annuler').css('display', 'none');
			$('.gpb-delete').css('display', 'inline-block');
			$('.gp-frame').removeAttr('disabled');
			$('.gp-select').removeAttr('disabled');
			editImage = false;
		}
		else if(editImage == "annuler")
		{
			$('.gpb-edit').html('Edit');
			$('.gpb-annuler').css('display', 'none');
			$('.gpb-delete').css('display', 'inline-block');
			$('.gp-frame').removeAttr('disabled');
			$('.gp-select').removeAttr('disabled');
			editImage = false;
			clearImg();
		}
		else if(editImage == false)
		{
			liste = JSON.parse(lcGet('liste_name'));
			imageSelected = liste[elementSelect]['images'][frameSelected];
			loadImg(imageSelected);
			$('.gpb-edit').html('Valider');
			$('.gpb-annuler').css('display', 'inline-block');
			$('.gpb-delete').css('display', 'none');
			$('.gp-frame').attr('disabled', 'disabled');
			$('.gp-select').attr('disabled', 'disabled');
			editImage = true;
		}
	}
	else
	{
		alert('Vous êtes en mode lecture !');
	}
}
//Fonction pour download l'element selectionné
function downloadElement()
{
	liste = JSON.parse(lcGet('liste_name'));
	listeImages = liste[elementSelect];
	var name = liste[elementSelect]['name']+'.txt';
	var value = btoa(JSON.stringify(listeImages));
	download(name, value);
}
//Fonction pour draw les pixel
function drawPiwel()
{
	$('.g-frame').html('');
	var heightFrame = $('.g-frame').height();
	var widthFrame = $('.g-frame').width();
	var pixelSize = widthFrame / nbPixelX;
	var nbPixelY = heightFrame / pixelSize;
	for(i=0;i<(nbPixelX * nbPixelY);i++)
	{
		$('.g-frame').append('<span class="gf-pixel" style="height:'+pixelSize+'px;width:'+pixelSize+'px;"></span>');
	}
}
//Créer un valeur local
function lcAdd(name, value)
{
	localStorage.setItem(name, value);
}
//Lire un cookie
function lcGet(name)
{
	return(localStorage.getItem(name));
}
//supprimer un cookie
function lcDelete(name)
{
	localStorage.removeItem(name);
}
//Fonction pour remetre en ordre un object
function resetOrderObject(object)
{
	var lengthObject = Object.keys(object).length;
	var newObject = {};
	var lengthNewObject = 0;
	for(i=0;(i-1)<lengthObject;i++)
	{
		if(object[i] !== undefined)
		{
			newObject[lengthNewObject] = object[i];
			lengthNewObject++;
		}
	}
	return(newObject);
}
//Fonction pour générer une uuid, source : http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid()
{
	function s4()
	{
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
//Fonction pour créer et télécharger un fichier, source : http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server
function download(filename, text)
{
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);
}
//Fonction pour lancer le play play d'images
function startPlayImage()
{
	nbImageRal = 0;
	liste = JSON.parse(lcGet('liste_name'));
	listeImages = liste[elementSelect]['images'];
	if(typeof listeImages[0] === 'object')
	{
		imagePlayStarted = setInterval(function (){
			if(lcGet('liste_name') !== null && typeof JSON.parse(lcGet('liste_name')) === 'object' && JSON.parse(lcGet('liste_name'))[0] !== undefined)
			{
				if(nbImageRal > ralImage)
				{
					if(imagesStarted == true)
					{
						playImage(listeImages);
					}
					nbImageRal = 0;
				}
				nbImageRal = nbImageRal + 1;
			}
		}, 1);
	}
}