import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { ActivatedRoute, NavigationEnd, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';
import { VigilanteGuard } from 'src/app/vigilante.guard';
import { GooService } from 'src/app/services/goo.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit{



  logout() {
    this.loginService.logout();
  }
  stickyHeader = false;
  activo: boolean = false;
  bothLogin:boolean=false;
  isUserVerified!:boolean;
  activeRoute: string = '';
  //NAVBAR
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.stickyHeader = window.scrollY > 0;
  }
  @ViewChild('menuIcon') menuIcon!: ElementRef;
  @ViewChild('navmenu') navmenu!: ElementRef;
  private routerSubscription: Subscription;
  userStatus!:boolean;
  constructor(
    private readonly oAuthService: OAuthService,
    public loginService: LoginService,
    private router: Router,
    private http: HttpClient,
    private esAdmin:VigilanteGuard,
    private activatedRoute:ActivatedRoute,
    private googleService: GooService
  ) {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.resetClasses();
      }
    });
  }
  ngOnInit(): void {
    this.isUserVerified = this.loginService.getUserStatus();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.activeRoute = event.url;
        console.log(this.activeRoute)
      }
    });

    console.log(this.esLoggedGoogle());
    console.log(this.bothLogin);
    console.log(this.loginService.userLoggedIn())
  }
  esLoggedGoogle(){
    return this.loginService.userLoggedInGoogle();

  }
  esAmbas(){
    return this.googleService.bothLogin()
  }
  esAdministrador(){
    return this.loginService.esAdmin();
  }
  esPaciente(){
    return this.loginService.esPaciente();
  }
  esVisitante(){
    return this.loginService.esVisitante();
  }
  logOutComponent(){
    this.logout()
    this.router.navigate(['/home'])
  }
  logoutGoogle(){
    this.oAuthService.logOut();
    sessionStorage.clear()
    this.router.navigate(['/home'])
  }
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  toggleMenu() {
    const iconElement = document.querySelector('i');
    const buttonElement = document.querySelector('.navMenu');
    if (iconElement && buttonElement) {
      if (this.activo == false) {
        iconElement.classList.replace('bx-menu', 'bx-x-circle');
        buttonElement.classList.add('open');
        this.activo = true;
      } else {
          iconElement.classList.replace('bx-x-circle', 'bx-menu');
          buttonElement.classList.remove('open');
          this.activo = false;
      }
    }
  }

  bothLogOut(){
  this.logout();
  console.log("primer logout")
  this.logoutGoogle();
  this.bothLogin = false;
  console.log("Segundo logout")
  }
  resetClasses() {
    const iconElement = document.querySelector('i');
    const buttonElement = document.querySelector('.navMenu');
    if (iconElement && buttonElement) {
      iconElement.classList.replace('bx-x-circle', 'bx-menu');
      buttonElement.classList.remove('open');
    }
  }
}