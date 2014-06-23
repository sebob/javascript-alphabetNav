function AlphabetFilter(obj)
{
    this.length = 0;
    this.items = {};
    this.tempItems = [];
    this.letter = null;
    
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        this.items[key] = value;
        return previous;
    };

    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    };
    
    this.getItemAndAllNext = function(){
        var key = this.letter;
        if(this.hasItem(key)) {
            var temp = [];
            this.each(function(k,v){
                if(key <= k) {
                    jQuery(v).each(function(i, value) {
                        temp.push(value);
                    });
                }
            });
        }
        this.tempItems = temp;
    };

    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    };
   
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    };

    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                jQuery(this.items[k]).each(function(key,value){
                    values.push(value);
                });
            }
        }
        return values;
    };

    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    };

    this.clear = function() {
        this.items = {};
        this.length = 0;
    };
    
    this.diff = function(old_array,new_array) {
        return $(old_array).not(new_array).get();
    };
    
    this.init = function() {
        var ul = jQuery('ul.list_publication_items');
        var allLi = jQuery(ul).find('li');
        var local = this;
        
        jQuery(allLi).each(function(k,v){
            var letter = jQuery(v).attr('date-name');
            local.setItem(letter,jQuery(ul).find('li[date-name="'+letter+'"]'));
            delete letter;
        });
        
        delete ul,allLi,local;
    };
    
    this.reload = function(ul) {

        if(this.tempItems.length > 0) {
            var diff = jQuery(this.values()).not(this.tempItems).get();
            var diff_index_last_element = (diff.length);        
            var diff_get_last_elements = (diff_index_last_element - 10);
            var offsetData = jQuery(diff).slice(diff_get_last_elements, diff_index_last_element);
            var tempArray = new Array();

            jQuery(offsetData).each(function(k,v){
                tempArray.push(v);
            });

            jQuery(this.tempItems).each(function(k,v){
                tempArray.push(v);
            });

            this.tempItems = tempArray;
            delete diff,diff_index_last_element,diff_get_last_elements,offsetData,tempArray;
            this.refresh(ul);
        }
    };
    
    this.refresh = function(ul) {
        var iterUl = 0;
        jQuery(ul).find('li').remove();
        jQuery(this.tempItems).each(function(k,v) {
            if(k != 0 && k % 10 == 0) {
                iterUl++;
            }

            var element = jQuery(ul).parent().find('ul').get(iterUl);
            jQuery(element).append(v);
            delete element;
        });
        delete iterUl;
    };
    
    this.setLetter = function(letter) {
        this.letter = letter;
    };
}

jQuery(document).ready(function(){   
    var next = jQuery('img.left');
    var prev = jQuery('img.right');
    var reset = jQuery('li.publications-button');
    var ul = jQuery('ul.list_publication_items');
    var i = 0, j = 0;
    var width = ul.outerWidth();
    var countElementsLi = 10;
    var letters = jQuery('#publications-alphabet span');
    
    var h = new AlphabetFilter();
    h.init();
    
    next.click(function(e) {        
        if(i == 0) {
            h.reload(ul);
            return false;
        }
                
        var ulLength = parseInt(jQuery(ul).find('li').length/countElementsLi);
        
        if( (j === ulLength - 1) || (i === ulLength + 1) )  {
            jQuery(e).stopPropagation();
        } else {
            ul.css({"left": "+=" + width + "px"});
            if(j !== ulLength - 1) {
                j++;
                i--;
            }
        }
        delete ulLength;
        return false;
    });
    
    prev.click(function(e) {
        
        var ulLength = parseInt(jQuery(ul).find('li').length/countElementsLi);
        
        if($(':animated').length || i == ulLength - 1) {
            return false;
        } 
        if( (i === ulLength - 1) || (j === ulLength + 1) ) {
            jQuery(e).stopPropagation();
        } else {
            ul.css({"left": "-=" + width + "px"});
            if(i !== ulLength - 1) {
                i++;
                j--;
            }
        }
        delete ulLength;
        return false;
    });
    
    reset.hover(function(){
        jQuery(ul).find('li').show();
        
        if(j > 0 && j > i) {
            var c = width * j;
            ul.css({"left": "-=" + c + "px"});
            j = 0;
            i = 0;
            delete c;
        }
        if(i > 0 && i > j) { 
            var c = width * i;
            ul.css({"left": "+=" + c + "px"});
            i = 0;
            j = 0;
            delete c;
        }
    });
    
    
    letters.click(function(){
        
        jQuery(this).addClass('active');
        h.setLetter(jQuery(this).html());
        h.getItemAndAllNext();
        h.refresh(ul);
        
        if(j > 0 && j > i) {
            var c = width * j;
            ul.css({"left": "-=" + c + "px"});
            j = 0;
            i = 0;
            delete c;
        }
        if(i > 0 && i > j) { 
            var c = width * i;
            ul.css({"left": "+=" + c + "px"});
            i = 0;
            j = 0;
            delete c;
        }
    });
    
    letters.click(function(){
        jQuery(this).prevAll().removeClass('active');
        jQuery(this).nextAll().removeClass('active');
    });
});