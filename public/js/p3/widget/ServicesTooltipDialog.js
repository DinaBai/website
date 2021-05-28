define([
  'dojo/_base/declare', 'dojo/on', 'dojo/dom-construct',
  'dojo/_base/lang', 'dojo/mouse',
  'dijit/popup', 'dijit/TooltipDialog',
  'dijit/Dialog', './app/GenomeAlignment', '../WorkspaceManager', './app/AppBase'
], function (
  declare, on, domConstruct,
  lang, Mouse,
  popup, TooltipDialog,
  Dialog, GenomeAlignment, WorkspaceManager, AppBase
) {

  return declare([TooltipDialog], {
    selection: null,
    label: '',
    //selectionList: null,
    //genome_id: null,
    //genome_name: null,
    genome_info: null,

    /* featureDetailLabels: [
      { label: 'Phylogenetic Tree', link: 'phylogeneticTree' },
      { label: 'Similar Genome Finder', link: 'amr' },
      { label: 'Subsystems', link: 'phylogeny' },
      { label: 'Antimicrobial Resistance', link: 'browser' }
    ], */

    _setSelectionAttr: function (val) {
      // console.log("DownloadTooltipDialog set selection: ", val);
      this.selection = val;
    },
    timeout: function (val) {
      var _self = this;
      this._timer = setTimeout(function () {
        popup.close(_self);
      }, val || 2500);
    },

    onMouseEnter: function () {
      if (this._timer) {
        clearTimeout(this._timer);
      }

      this.inherited(arguments);
    },
    onMouseLeave: function () {
      popup.close(this);
    },

    startup: function () {
      if (this._started) {
        return;
      }
      on(this.domNode, Mouse.enter, lang.hitch(this, 'onMouseEnter'));
      on(this.domNode, Mouse.leave, lang.hitch(this, 'onMouseLeave'));
      // var _self = this;
/*       on(this.domNode, '.wsActionTooltip:click', function (evt) {
        // console.log("evt.target: ", evt.target, evt.target.attributes);
        // var rel = evt.target.attributes.rel.value;

      }); */

      var _self = this;
      on(this.domNode, '.wsActionTooltip:click', function (evt) {
        // console.log("evt.target: ", evt.target, evt.target.attributes);
        var rel = evt.target.attributes.rel.value;
        _self.actOnSelection(rel);
      });

      var dstContent = domConstruct.create('div', {});
      this.labelNode = domConstruct.create('div', { style: 'background:#09456f;color:#fff;margin:0px;margin-bottom:4px;padding:4px;text-align:center;' }, dstContent);
      this.selectedCount = domConstruct.create('div', {}, dstContent);


      // var d = domConstruct.create('div', {}, dstContent);
      // domConstruct.create('a', { 'class': 'navigationLinkOut', innerHTML: 'Phylogenetic Tree', href: '/view/PathwaySummary/?features=' + this.selectionList.join(',') }, d);
      // var d = domConstruct.create('div', {}, dstContent);
      // //domConstruct.create('a', { 'class': 'navigationLinkOut', innerHTML: 'Genome Alignment', href: '/view/GenomeList/?in(genome_id,(' + this.genome_id + '))#view_tab=subsystems&filter=in(' + this.selectionList.join(',') + ')' }, d);
      // //domConstruct.create('a', { 'class': 'navigationLink', innerHTML: 'Genome Alignment', href: '/app/GenomeAlignment/?genome_name=' + this.genome_name  }, d);
      // domConstruct.create('div', {'class' : 'wsActionTootip', rel: 'GenomeAlignment', innerHTML: 'Genome Alignment' }, d);
      // //domConstruct.create('a', { 'class': 'navigationLink', innerHTML: 'Genome Alignment', href: '/app/GenomeAlignment'  }, d);

      // var d = domConstruct.create('div', {}, dstContent);
      // domConstruct.create('a', { 'class': 'navigationLinkOut', innerHTML: 'Comparative Pathway', href: '/view/GenomeList/#view_tab=specialtyGenes&filter=and(eq(property,"Virulence%20Factor"),in(feature_id,(' + this.selectionList.join(',') + ')))' }, d);
      // //var d = domConstruct.create('div', {}, dstContent);
      // //domConstruct.create('a', { 'class': 'navigationLinkOut', innerHTML: 'Antimicrobial Resistance', href: '/view/GenomeList/#view_tab=amr&filter=in(' + this.selectionList.join(',') + ')' }, d);
      // this.set('content', dstContent);

      var table = domConstruct.create('table', {}, dstContent);

      var tr = domConstruct.create('tr', {}, table);
      var tData = this.tableCopyNode = domConstruct.create('td', { style: 'vertical-align:top;' }, tr);
      // spacer
      domConstruct.create('td', { style: 'width:10px;' }, tr);
      this.otherCopyNode = domConstruct.create('td', { style: 'vertical-align:top;' }, tr);

      domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'genome_alignment', innerHTML: 'Genome Alignment' }, tData);
      domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'genome_distance', innerHTML: 'Similar Genome Finder' }, tData);
      domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'phylogentic_tree', innerHTML: 'Phylogenetic Tree' }, tData);
      domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'comparative_pathway', innerHTML: 'Comparative Pathway' }, tData);



      //domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'full_wo_header', innerHTML: 'Full Table (without headers)' }, tData);
      //domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'selected_w_header', innerHTML: 'Selected Rows (with headers)' }, tData);
      //domConstruct.create('div', { 'class': 'wsActionTooltip', rel: 'selected_wo_header', innerHTML: 'Selected Rows (without headers)' }, tData);

      tr = domConstruct.create('tr', {}, table);
      domConstruct.create('td', { colspan: 3, style: 'text-align:right' }, tr);

      this.set('content', dstContent);

      this._started = true;
      this.set('label', 'Services');
      this.set('selection', this.selection);

    },

    actOnSelection: function (type) {
      console.log (type);

      if (type == 'genome_alignment') {

        var genomeAlignment = new GenomeAlignment();
        genomeAlignment.appParams = this.genome_info;


        // console.log("Selection: ", _self.selection);
        var d = new Dialog({ 
          title: 'Genome Alignment',
          content: genomeAlignment });
        //var ad = new AdvancedDownload({ selection: _self.selection, containerType: _self.containerType });
        
        //domConstruct.place("junk", d.containerNode);
        d.show();
        return;
      }
      
    },

    _setLabelAttr: function (val) {
      this.label = val;
      if (this._started) {
        this.labelNode.innerHTML = val;
      }
    }
  });

});
