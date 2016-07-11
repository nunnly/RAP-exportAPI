(function(){
    var form = new Vue({
        el: '#form',
        data: {
            projectId: '2',
            type: 'preview'
        },
        methods:{
            doclick: function(e){
                if(this.type === 'preview'){
                    e.target.removeAttribute('download');
                }else{
                    e.target.setAttribute('download','download')
                }
                e.target.href='/getAPI/' + this.type + '/' + this.projectId;

                // window.open('/getAPI/' + this.type + '/' + this.projectId);
            }
        }

    })
    })()
