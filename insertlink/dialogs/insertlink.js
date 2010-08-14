(function() {

CKEDITOR.dialog.add('insertlink', function(editor) {
    var urlRegex = /^(?:http|https|ftp|news):\/\/(.*)$/i;
    return {
        title: editor.lang.link.title,
        minWidth: 350,
        minHeight: 50,
        contents: [
            {
                id: 'info',
                label: editor.lang.link.info,
                title: editor.lang.link.info,
                elements: [
                    {
                        type: 'text',
                        id: 'url',
                        label: editor.lang.link.info,
                        required: true,
                        onLoad: function() {
                            this.allowOnChange = true;
                        },
                        validate: function() {
                            var func = CKEDITOR.dialog.validate.notEmpty(editor.lang.link.noUrl);
                            return func.apply(this);
                        },
                        setup: function(data) {
                            this.allowOnChange = false;
                            if (data.url) this.setValue(data.url);
                            else this.setValue("http://");
                            this.allowOnChange = true;
                        },
                        commit: function(data) {
                            data.url = this.getValue();
                            this.allowOnChange = false;
                        }
                    }
                ]
            }
        ],
        onShow: function() {
            var editor = this.getParentEditor(),
                selection = editor.getSelection(),
                element = CKEDITOR.plugins.link.getSelectedLink(editor),
                options = {url: 'http://'};
            if (element && (element.getAttribute('_cke_saved_href') || element.getAttribute('href'))) {
                selection.selectElement(element);
                options.url = element.getAttribute('_cke_saved_href') || element.getAttribute('href');
            }
            this._.selectedElement = element;
            this.setupContent(options);
        },
        onOk: function() {
            var attributes = {href: 'javascript:void(0);'},
                data = {url: attributes.href};
            this.commitContent(data);
            attributes._cke_saved_href = data.url.match(urlRegex) ? data.url : 'http://' + data.url;
            if (!this._.selectedElement) {
                var selection = editor.getSelection(),
                    ranges = selection.getRanges();
                if (ranges.length == 1 && ranges[0].collapsed) {
                    var text = new CKEDITOR.dom.text(data.url, editor.document);
                    ranges[0].insertNode(text);
                    ranges[0].selectNodeContents(text);
                    selection.selectRanges(ranges);
                }

                var style = new CKEDITOR.style({element: 'a', attributes: attributes});
                style.type = CKEDITOR.STYLE_INLINE;
                style.apply(editor.document);
            } else {
                var element = this._.selectedElement,
                    href = element.getAttribute('_cke_saved_href'),
                    textView = element.getHtml();
                element.setAttributes(attributes);
                if (href == textView)
                    element.setHtml(attributes._cke_saved_href);
                delete this._.selectedElement;
            }
        }
    };
});

})();
