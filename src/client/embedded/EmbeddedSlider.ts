import jQuery from 'jquery';

export class EmbeddedSlider {

    $sliderDiv: JQuery<HTMLElement>;

    /**
     * A div contains $container and another div. Between the latter two 
     * a slider should get inserted.
     * @param $container 
     * @param firstLast true, if $container is left/on top of other div; false if otherwise
     * @param horVert true, if $container and other div are left/right of another; false if they are on top/below each other
     * @param callback 
     * @param $otherDiv 
     */
    constructor(private $container: JQuery<HTMLElement>, 
        private firstLast: boolean, private horVert: boolean,
         private callback: (newLength: number) => void, private $otherDiv?: JQuery<HTMLElement>){
            this.initSlider();
    }

    initSlider() {
        let that = this;

        if(this.$otherDiv == null){
            this.$container.parent().children().each((index, element) => {
                if(element != this.$container[0]){
                    that.$otherDiv = jQuery(element);
                }
            });
        }

        this.$sliderDiv = jQuery('<div class="joe_slider"></div>');

        this.$sliderDiv.css({
            width: this.horVert ? "100%" : "4px",
            height: this.horVert ? "4px" : "100%",
            cursor: this.horVert ? "row-resize" : "col-resize",
        });

        if(this.firstLast){
            this.$sliderDiv.css({
                top: "0px",
                left: "0px"
            });
        } else {
            if(this.horVert){
                this.$sliderDiv.css({
                    bottom: "0px",
                    left: "0px"
                });    
            } else {
                this.$sliderDiv.css({
                    top: "0px",
                    right: "0px"
                });    
            }
        }

        this.$container.append(this.$sliderDiv);

        let mousePointer = window.PointerEvent ? "pointer" : "mouse";

        this.$sliderDiv.on(mousePointer + "down", (md: JQuery.MouseDownEvent) => {

            let x = md.clientX;
            let y = md.clientY;

            let ownRectangle = this.$container[0].getBoundingClientRect();
            let ownStartHeight = ownRectangle.height;
            let ownStartWidth = ownRectangle.width;
            let otherRectangle = this.$otherDiv[0].getBoundingClientRect();
            let otherStartHeight = otherRectangle.height;
            let otherStartWidth = otherRectangle.width;


            jQuery(document).on(mousePointer + "move.slider", (mm: JQuery.MouseMoveEvent) => {
                let dx = mm.clientX - x;
                let dy = mm.clientY - y;

                if(this.horVert){
                    let newHeight = ownStartHeight + (this.firstLast ? -dy : dy);
                    let newOtherHeight = otherStartHeight + (this.firstLast ? dy : -dy);
                    this.$container.css('height', newHeight + "px");
                    this.$otherDiv.css('height', newOtherHeight + "px");
                    this.$container.css('max-height', newHeight + "px");
                    this.$otherDiv.css('max-height', newOtherHeight + "px");
                    this.callback(newHeight);
                } else {
                    let newWidth = ownStartWidth + (this.firstLast ? -dx : dx);
                    let newOtherWidth = otherStartWidth + (this.firstLast ? dx : -dx);
                    this.$container.css('width', newWidth + "px");
                    this.$otherDiv.css('width', newOtherWidth + "px");
                    this.$container.css('max-width', newWidth + "px");
                    this.$otherDiv.css('max-width', newOtherWidth + "px");
                    this.callback(newWidth);
                }
                this.$container.css('flex', "0 1 auto");
        
            });

            jQuery(document).on(mousePointer + "up.slider", () => {
                jQuery(document).off(mousePointer + "move.slider");
                jQuery(document).off(mousePointer + "up.slider");
            });


        });

        setTimeout(() => {
            that.slide(1, 1);
        }, 600);

    }

    setColor(color: string){
        this.$sliderDiv.css('background-color', color);
    }

    slide(dx: number, dy: number){

    }


}