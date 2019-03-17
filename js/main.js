$(document).ready(function(){
    //API
    var _url = "https://my-json-server.typicode.com/dimput/latihan-pwa-public/mahasiswa";
    // var _url = 'http://localhost:8787/index.php';

    //Store Data
    var result = '';

    //Store Gender for Option
    var gender_opt = '';

    //Store All gener from API
    var gender = [];

    //$.get (_url,function(data){
        function renderPage(data){
        $.each (data,function(key,items){
            //Store Gender
            _gend = items.gender;
            result +=   '<div class="col-3 card">' +
                            '<p><b>' + items.name + '</b></p>' +
                            '<p>' + _gend + '</p>' +
                        '</div>';
            if ($.inArray(_gend, gender) === -1){
                //if gender not Found
                //then input gender opt
                gender.push(_gend);
                gender_opt += '<option value="' + _gend + '">' + _gend +'</option>';
            }
            
        });

    // use Selector by Id mhs-list
    // Replace inner HTML
    $('#mhs-list').html(result);

    /**
     * 
     */
    $('#gender-select').html('<option value="semua">Semua</option>'+gender_opt);
    //});
    };
    var networkDataReceive = false ;
    //cek di Cache ,apakah sudah ada belum
    var networkUpdate = fetch(_url).then(function(response){
        return response.json();
    }).then( function(data){
        networkDataReceive=true;
        renderPage(data)
    });

    //fecth data dari Cache
caches.match(_url).then(function(response){
    if(!response)throw Error ("tidak ada data di cache");

}).then(function(data){
    if(!networkDataReceive){
        renderPage(data);
        console.log('render data dari cache');
    }

}).catch(function(){
    return networkUpdate;
})
    //filter untuk option gender
    $('#gender-select').on('change', function(){
        updatelist($(this).val());
    });

    function updatelist(opt){

    var _url2 = _url;

    if(opt !== 'semua'){
        _url2 = _url + '?gender='+opt;
    }

    //Store Data
    var result = '';


    $.get (_url2,function(data){
        $.each(data,function(key,items){
            //Store Gender
            _gend = items.gender;
            result +=   '<div class="col-3 card">' +
                            '<p><b>' + items.name + '</b></p>' +
                            '<p>' + _gend + '</p>' +
                        '</div>';
        });

    // use Selector by Id mhs-list
    // Replace inner HTML
    $('#mhs-list').html(result);
    });
    }

    Notification.requestPermission(function(status){
        console.log("Notification Permission ", status);
    });

    function displayNotification() {
        if (Notification.permission === 'granted'){
            navigator.serviceWorker.getRegistration()
            .then(function(reg) {
                var options = {
                    body : 'ini body notifikasi',
                    icon : 'images/logo.jpg',
                    vibrate : [100,50,100],
                    data : {
                        dateOfArrival : Date.now(),
                        primaryKey : 1
                    },
                    actions : [
                        {action : 'explore', title : 'Kunjungi situs'},
                        {action : 'close',  title : 'Tutup'}
                    ]
                }
                reg.showNotification('Judul Notifikasi', options);
            })
        }
    }

    $('#btn-notification').on('click', function() {
        displayNotification();
    });

});


//Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }