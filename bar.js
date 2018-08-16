var res_min = 10;
var res_max = 300;
var res_types = ["manpower", "ammo", "rations", "parts"];
var array = [
             ["Scopes",       [ 10,300], [ 10,150], [ 10,300], [ 10,150]],
             ["Night vision", [ 50,300], [ 10,300], [100,300], [ 10,300]],
             ["Silencer",     [ 50,300], [ 10,300], [ 10,300], [ 10,300]],
             ["Bullets",      [ 10,300], [150,300], [ 10,300], [ 50,300]],
             ["Exoskeletons", [ 50,300], [ 10,300], [ 10,300], [ 50,300]],
             ["Armor plate",  [ 50,300], [ 10,300], [ 50,300], [ 50,300]],
             ["Ammo box",     [ 10,300], [ 10,300], [ 10,300], [150,300]],
             ["Camo cape",    [100,300], [ 10,300], [100,300], [ 10,300]],
            ];
var marker_prefix = 'm_';
var text_prefix = 't_';
var in_all = 'in_all';
var label_prefix = 'label_';
var container_prefix = 'line_';
var sep = '-';
var child_to_avoid = 'marker0'; //a hack to skip events from marker

function init_resize_bars() {
  for (var i = 0; i < array.length; i++) {
    for (var x = 0; x < res_types.length; x++) {
      var inner = document.getElementById('p_' + i + '_' + x);
      var el = array[i][x+1];
      inner.style.left = 100*(el[0]-res_min)/(res_max-res_min) + "%";
      inner.style.width = 100*(el[1]-el[0])/(res_max-res_min) + "%";
    }
    document.getElementById(label_prefix + i).innerHTML = array[i][0];
  }
}

function update_text(value, index) {
  document.getElementById(text_prefix + index).innerHTML = value;
}

function update_marker(value, index) {
  document.getElementById(marker_prefix + index).style.left = value + "%";
}

// helper functions
function clamp(ar) {
  var new_ar = Array();
  var length = ar.length;
  for (var i = 0; i < length; i++) {
    new_ar.push(Math.min(Math.max(ar[i], res_min), res_max));
  }
  return new_ar;
}

function value_to_percent(value) {
  return Math.round((value-res_min)/(res_max-res_min)*100);
}

function percent_to_value(percent) {
  return Math.round(percent/100*(res_max-res_min)+res_min);
}

function set_disabled(el_id, set) {
  var classes = document.getElementById(el_id).classList;
  var dis = "disabled";
  if (set) {
    if (!classes.contains(dis)) {
      classes.add(dis);
    }
  } else {
    if (classes.contains(dis)) {
      classes.remove(dis);
    }
  }
}
// helpers' end

function update_text_all(intext) {
  var a = clamp(intext.split(/[^0-9]/).map(Number));
  var len = res_types.length;
  if (a.length != len) {
    return;
  }
  for (var x = 0; x < len; x++) {
    update_text(a[x], x);
    update_marker(value_to_percent(a[x]), x);
  }
  document.getElementById(in_all).value = a[0] + sep + a[1] + sep + a[2] + sep + a[3];
  // now disable out-of-range equips
  for (var i = 0; i < array.length; i++) {
    var on = true;
    for (var k = 0; k < len; k++) {
      on = on && (array[i][k+1][0] <= a[k]) && (a[k] <= array[i][k+1][1]);
    }
    set_disabled(container_prefix + i, !on);
  }
}

function update_all() {
  var str = "";
  for (var x = 0; x < res_types.length; x++) {
    str += document.getElementById(text_prefix + x).innerHTML + "-";
  }
  update_text_all(str.slice(0, -1));
}

function click_event(e, index) {
  if (e.buttons != 1) {
    return;
  }
  if (e.target.classList.contains(child_to_avoid)) {
    return;
  }
  var rect = e.target.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var lx = rect.right - rect.left;
  var ly = rect.bottom - rect.top;
  if (lx == 0) {
    return;
  }
  var percent = Math.round(100*x/lx);
  update_marker(percent, index);
  update_text(percent_to_value(percent), index);
  update_all();
}

function adjust(index, amount) {
  var v = Number(document.getElementById(text_prefix + index).innerHTML);
  if (v <= res_min || v >= res_max || v+amount < res_min || v+amount > res_max) {
    return;
  }
  document.getElementById(text_prefix + index).innerHTML = v + amount;
  update_all();
}
