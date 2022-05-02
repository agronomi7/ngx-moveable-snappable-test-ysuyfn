import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import Dragger from "@daybrush/drag";
import { hasClass, addClass, removeClass } from "@daybrush/utils";

@Component({
  selector: "ngx-guidelines",
  styleUrls: ["./ngx-guidelines.component.css"],
  template: `
    <div class="ruler" #rulerRef></div>
    <div class="guidelines {{ type }}" #guidelinesRef>
      <div class="guideline adder {{ type }}" #adderRef></div>
      <div
        *ngFor="let pos of guidelines"
        class="guideline {{ type }}"
        style.transform="translateY({{ pos }}px)"
      ></div>
    </div>
  `
})
export class NgxGuidelinesComponent implements AfterViewInit {
  type = "horizontal";
  zoom = 1;
  scrollPos = 0;
  guidelines = [];
  @Output() setGuidelines: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild("guidelinesRef", { static: false }) guidelinesRef: ElementRef;
  @ViewChild("adderRef", { static: false }) adderRef: ElementRef;
  @ViewChild("rulerRef", { static: false }) rulerRef: ElementRef;

  ngAfterViewInit() {
    // console.log(Dragger, test);
    new Dragger(this.rulerRef.nativeElement, {
      container: document.body,
      dragstart: e => {
        e.datas.fromRuler = true;
        this.dragStartToAdd(e);
      },
      drag: this.drag,
      dragend: this.dragEnd
    });
    new Dragger(this.guidelinesRef.nativeElement, {
      container: document.body,
      dragstart: this.dragStartToChange,
      drag: this.drag,
      dragend: this.dragEnd
    });
  }
  public dragStartToChange = ({ datas, clientX, clientY, inputEvent }) => {
    const target = inputEvent.target;

    if (!hasClass(target, "guideline")) {
      return false;
    }
    datas.target = target;
    this.dragStart({ datas, clientX, clientY, inputEvent });
  };
  public dragStartToAdd = ({ datas, clientX, clientY, inputEvent }) => {
    datas.target = this.adderRef.nativeElement;
    this.dragStart({ datas, clientX, clientY, inputEvent });
  };
  public dragStart = ({ datas, clientX, clientY, inputEvent }) => {
    const isHorizontal = this.type === "horizontal";
    const rect = this.guidelinesRef.nativeElement.getBoundingClientRect();
    datas.offset = isHorizontal ? rect.top : rect.left;
    addClass(datas.target, "dragging");
    this.drag({ datas, clientX, clientY });

    inputEvent.stopPropagation();
    inputEvent.preventDefault();
  };
  public drag = ({ datas, clientX, clientY }) => {
    const type = this.type;
    const isHorizontal = type === "horizontal";
    const nextPos = Math.round(
      (isHorizontal ? clientY : clientX) - datas.offset
    );
    datas.target.style.transform = `translateY(${nextPos}px)`;

    return nextPos;
  };
  public dragEnd = ({ datas, clientX, clientY }) => {
    const pos = this.drag({ datas, clientX, clientY });
    const guidelines = this.guidelines;
    const guidelinePos = Math.round(pos / this.zoom);

    removeClass(datas.target, "dragging");

    if (datas.fromRuler) {
      if (pos >= this.scrollPos && guidelines.indexOf(guidelinePos) < 0) {
        this.guidelines = [...guidelines, guidelinePos];

        console.log("짤떠요");
        this.setGuidelines.emit(this.guidelines);
      }
    } else {
      const index = datas.target.getAttribute("data-index");

      if (pos < this.scrollPos || guidelines.indexOf(guidelinePos) > -1) {
        guidelines.splice(index, 1);
      } else {
        guidelines[index] = guidelinePos;
      }
      this.guidelines = [...guidelines];
      this.setGuidelines.emit(this.guidelines);
    }
  };
}
