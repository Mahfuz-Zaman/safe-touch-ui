import {Directive, ElementRef, EventEmitter, HostListener, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Directive({
  selector: '[appOutSideClick]'
})
export class OutSideClickDirective {

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
  ) {}

  showBackToTop = false;

  @Output()
  outsideClick: EventEmitter<MouseEvent> = new EventEmitter();

  @Output()
  insideClick: EventEmitter<MouseEvent> = new EventEmitter();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

    @HostListener('window:scroll', ['$event'])
    onWindowScroll($event) {
      ($event.target.documentElement.scrollTop > 415) ? this.showBackToTop = true : this.showBackToTop = false;
    }

  @HostListener('document:mousedown', ['$event'])
  onClick(event: MouseEvent): void {
    this.isHandset$.subscribe(isHandset => {
      if (!isHandset && this.router.url === '/') {
        if(this.showBackToTop) {
          if (!this.elementRef.nativeElement.contains(event.target)) {
            this.outsideClick.emit(event);
          } else  {
            this.insideClick.emit(event);
          }
        } else {
          return false;
        }
        
      } else {
        if (!this.elementRef.nativeElement.contains(event.target)) {
          this.outsideClick.emit(event);
        } else  {
          this.insideClick.emit(event);
        }
      }
    });
  }

}
