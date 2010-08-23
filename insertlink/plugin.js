(function() {

CKEDITOR.plugins.add('insertlink', {
    requires: ['dialog'],

    init: function(editor) {
        editor.addCommand('insertlink', new CKEDITOR.dialogCommand('insertlink'));

        editor.ui.addButton('InsertLink', {
            label: editor.lang.link.toolbar,
            className: 'cke_button_link',
            command: 'insertlink'
        });

        CKEDITOR.dialog.add('insertlink', this.path + "dialogs/insertlink.js")

        editor.on('doubleclick', function(e) {
            var element = CKEDITOR.plugins.link.getSelectedLink(editor) || e.data.element;

            if (element.is('a') && element.getAttribute('href')) {
                e.data.dialog = 'insertlink';
            }
        });

        if (editor.addMenuItems) {
            editor.addMenuItems({
                link: {
                    label : editor.lang.link.menu,
                    command : 'insertlink',
                    group : 'link',
                    order : 1
                }
            });
        }
    }
});

})();
