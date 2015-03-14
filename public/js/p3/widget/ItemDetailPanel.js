define([
	"dojo/_base/declare","dijit/_WidgetBase","dojo/on",
	"dojo/dom-class", "dijit/_TemplatedMixin", "dijit/_WidgetsInTemplateMixin",
	"dojo/text!./templates/ItemDetailPanel.html","dojo/_base/lang","./formatter","dojo/dom-style"
], function(
	declare, WidgetBase, on,
	domClass,Templated,WidgetsInTemplate,
	Template,lang,formatter,domStyle
){
	return declare([WidgetBase,Templated,WidgetsInTemplate], {
		"baseClass": "ItemDetailPanel",
		"disabled":false,
		"changeableTypes":{unspecified:{label:"unspecified",value:"unspecified"},contigs:{label:"contigs",value:"contigs"},reads:{label:"reads",value:"reads"},diffexp_input_data:{label:"diffexp_input_data",value:"diffexp_input_data"},diffexp_input_metadata:{label:"diffexp_input_metadata",value:"diffexp_input_metadata"}},
		templateString: Template,
		item: null,
		property_aliases: {
			document_type: "type",
			"organism_name": "name"
		},
		startup: function(){
			var _self=this;
			//if (this._started) { return; }
			var currentIcon;
			this.watch("item", lang.hitch(this,function(prop,oldVal,item){
				console.log("ItemDetailPanel Set(): ", arguments);
				domClass.remove(_self.typeIcon,currentIcon)
				var t = item.document_type || item.type;
				switch(t){
					case "folder": 
						domClass.add(_self.typeIcon,"fa fa-folder fa-2x")
						currentIcon="fa fa-folder fa-2x";
						break;
					//case "contigs": 
					//	domClass.add(_self.typeIcon,"fa icon-contigs fa-3x")
					//	currentIcon="fa fa-folder fa-3x";
					//	break;
					case "contigs": 
						domClass.add(_self.typeIcon,"fa icon-contigs fa-2x")
						currentIcon="fa fa-contigs fa-2x";
						break;
					case "fasta": 
						domClass.add(_self.typeIcon,"fa icon-fasta fa-2x")
						currentIcon="fa icon-fasta fa-2x";
						break;
					case "genome_group": 
						domClass.add(_self.typeIcon,"fa icon-genome_group fa-2x")
						currentIcon="fa icon-genome_group fa-2x";
						break;
					case "job_result":
						domClass.add(_self.typeIcon, "fa fa-flag-checkered fa-2x")
						currentIcon="fa icon-flag-checkered fa-2x";
						break;
					case "feature_group": 
						domClass.add(_self.typeIcon,"fa icon-genome-features fa-2x")
						currentIcon="fa icon-genome-features fa-2x";
						break;
	
					default: 
						domClass.add(_self.typeIcon,"fa fa-file fa-2x")
						currentIcon="fa fa-file fa-2x";
						break;
				}	
				Object.keys(item).forEach(function(key){
       	                		var val = item[key];
					if(key == "creation_time"){
						val=formatter.date(val);
					}
					if (key == "type"){
						_self[key + "Node"].set('value',val);
						_self[key + "Node"].set('displayedValue',val);
						if (this.changeableTypes.hasOwnProperty(val)){
							_self[key + "Node"].set('disabled',false);
							domStyle.set(_self[key + "Node"].domNode,"text-decoration","underline");
							var type_options=[];
							Object.keys(this.changeableTypes).forEach(function(change_type){
								type_options.push(this.changeableTypes[change_type]);
							}, this);
							_self[key + "Node"].editorParams.options=type_options;
						}
						else{
							_self[key + "Node"].set('disabled',true);
							domStyle.set(_self[key + "Node"],"text-decoration","none");
						}
					}	
					else if (this.property_aliases[key] && _self[this.property_aliases[key] + "Node"]){
						_self[this.property_aliases[key] + "Node"].innerHTML=val;	
					}else if (this.property_aliases[key] && _self[this.property_aliases[key] + "Widget"]){
						_self[this.property_aliases[key] + "Widget"].set("value",val);
					}else if (_self[key + "Node"]){
						_self[key+"Node"].innerHTML=val;
					}else if (_self[key +"Widget"]){
						_self[key+"Widget"].set("value",val);
					}else if (key == "autoMeta"){
						var curAuto = formatter.autoLabel("itemDetail", item.autoMeta);
						subRecord=[];
						Object.keys(curAuto).forEach(function(prop){
							if (!curAuto[prop] || prop=="inspection_started") { return; }
							if (curAuto[prop].hasOwnProperty("label") && curAuto[prop].hasOwnProperty("value")){
								subRecord.push('<div class="ItemDetailAttribute">'+curAuto[prop]["label"]+': <span class="ItemDetailAttributeValue">'+curAutoLabel[prop]["value"]+'</span></div></br>');
							}
							else if (curAuto[prop].hasOwnProperty("label")){
								subRecord.push('<div class="ItemDetailAttribute">'+curAuto[prop]["label"]+'</div></br>');
							}
						},this);
						_self["autoMeta"].innerHTML=subRecord.join("\n");
					//	Object.keys(val).forEach(function(aprop){
					//	},this);
					}
				},this);
			}))
			this.inherited(arguments);
		}

	});
});
