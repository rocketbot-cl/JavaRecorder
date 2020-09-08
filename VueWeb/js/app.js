angular.module('recorder', [])
  .controller('RecorderController', function($scope) {
    $scope.clicks = [];
    $scope.data = [];
    var old_data, new_data;
    $scope.getData = function(){
        if (ret_data) {
            ret_data = false
            $.ajax({
                type: "GET",
                url: "http://localhost:8000/get_object",
                success: function (data) {
                    console.log(data)
                    $scope.data = data;
                    
                    if(!$scope.digest){
                        $scope.$apply()
                    }
                    try {
                        if (data.click) {
                            $("#is_click").text("SI")
                        }
                    
                    } catch (e) {

                    }
                    ret_data = true;
                },
                error: function (e) {
                    console.log(e)
                    ret_data = true
                }
            });
        }
    }
    $scope.setStatusCheck = function (id, ch) {
        var da = { id: id, status:ch }
        console.log(da)
        $.post("/setAvailable", da, function (res) {
        })
    }
     $scope.getClick = function () {
        $.get("/getClicks").then(function (data) {
            new_data = data;
            
            if (!_.isEqual(new_data, old_data)) {
                
                old_data = angular.copy(data);
                
                //console.log(data, old_data)
                
                $scope.clicks = angular.copy(data);
            }
            
            var html_data = [];
            var counterSet = 0
            var counterSel = 0
            if(data.length ==0){
                $("#clicks").html($("#empty_data").html());
            }
            for (var t = 0; t < data.length; t++) {
                app_name = data[t].app.app;
                var est = $("#clicks_template").html();
                est = est.replace("{{number}}", t+1)
                est = est.replace("{{app}}", data[t].app.app);
                est = est.replace("{{title}}", data[t].app.title);
                est = est.replace("{{module}}", data[t].module.module)
                est = est.replace("{{id_event}}", data[t].id)
                est = est.replace("{{position}}", t)
                est = est.replace("{{position}}", t)
                est = est.replace("{{position}}", t)
                if(data[t].module.module == "SetValue"){
                    text = data[t].text
                    est = est.replace("{{input}}", "<input class='form-control SetValue-input' type='text' value=\'"+ text +"\' onchange='changeText(\""+text+"\","+t+","+counterSet+")'/>")
                    counterSet++
                }else if(data[t].module.module == "SelectItem"){
                    est = est.replace("{{input}}", "<input class='form-control selectItem-input' type='text' onchange='ItemName("+t+","+counterSel+")'/>")
                    counterSel++
                }
                else{
                    est = est.replace("{{input}}", "<p style='display:none'></p>")
                }
                try {
                    var tmp = data[t].control;
                    var cap = tmp.capture;
                    delete tmp.capture;

                    var parent_ = '<table class="table table-sm table-striped"  style="border-bottom: 3px solid #6F6F6E;"><thead><tr><th>Act.</th><th>Ctrl Id</th><th>Clase</th><th>Title</th><th>Index</th></tr></thead><tbody>';
                    for (var ttt = 0; ttt < data[t].parent.length; ttt++) {
                        //console.log("sss", data[t].parent[ttt])
                        parent_ = parent_ + "<tr><td><input " + (data[t].parent[ttt].act ? "checked" : "") + " type='checkbox' onchange='setStatusCheck(\"" + data[t].parent[ttt].id  +"\", this,)' id='" + data[t].parent[ttt].id + "'></td><td> " + data[t].parent[ttt].ctrlid + "</td><td>" + data[t].parent[ttt].cls + "</td><td>" + data[t].parent[ttt].title + "</td><th>"+ data[t].parent[ttt].idx +"</th></tr>";
                    }
                    parent_ = parent_ + "</tbody></table>";
                    est = est.replace("{{parent}}", parent_)
                    est = est.replace("{{capture}}", cap);
                    html_data = html_data + est.replace("{{data}}", JSON.stringify(tmp))
                } catch (r) {

                }
            }
            if (!arraysEqual(cliks_view_data, html_data)) {

                cliks_view_data = html_data;
                try {
                    $("#alert1").modal("hide");
                    $("#clicks").html(cliks_view_data);
                } catch (e) {
                    console.log(e)
                }
            }
            
            
        });
    };
    var interval = setInterval(function () {
        $scope.getData()
        //$scope.getClick()
    }, 500)

  })
  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        
        if (a[i] !== b[i]) return false;
    }
    return true;
}