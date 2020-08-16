import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { apiHttpSpringBootService } from './../api-spring-boot.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { DatePipe } from '@angular/common';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { UserModel, StatistiquesChartsUsersModel } from '../interfaces/models';

@Component({
  selector: 'app-list-users-admin',
  templateUrl: './list-users-admin.component.html',
  styleUrls: ['./list-users-admin.component.css']
})
export class ListUsersAdminComponent implements OnInit {

  public infosUser: UserModel = new UserModel();

  public users: Array<UserModel> = [];

  public page = 1;

  public pageSize = 4;

  public collectionSize = 0;

  barChartOptions: ChartOptions = {
                                   responsive: true,
             };
  //barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [  { data: [], label: 'Best Fruits' } ];


  constructor(private router: Router, private cookie: CookieService, private apiService: apiHttpSpringBootService,
              private ngxService: NgxUiLoaderService,private datePipe: DatePipe) {

    if (this.cookie.get('infosUser')) {

      this.infosUser = JSON.parse(this.cookie.get('infosUser'));

      this.apiService.checkAdminByToken(this.infosUser).subscribe((data: any) => {

        if (data) {

          if (this.infosUser.photoUser === '' || !this.infosUser.photoUser) {

            if (this.infosUser.sex === 'F') {

              this.infosUser.photoUser = './assets/img/users/user_f.png';


            }

            if (this.infosUser.sex === 'H') {

              this.infosUser.photoUser = './assets/img/users/user_m.png';


            }

          }



          console.log('ProfilUserComponent', this.infosUser);

          this.getListUsers();

        } else {

          this.router.navigate(['/admin-login']);
        }



      }, (error: any) => {

        this.router.navigate(['/admin-login']);
      });



    } else {

      this.router.navigate(['/admin-login']);
    }

  }

  ngOnInit(): void { 

     //  const data = [45, 37, 60, 70, 46, 33];

       //this.barChartData[0].data = data;

       this.getStatistiquesUsers();

   }

   getStatistiquesUsers(){

       this.apiService.getStatistiquesCharts().subscribe((dataUsers: Array<StatistiquesChartsUsersModel>) => {

        dataUsers.forEach(element => {

               console.log(element);

               this.barChartData[0].data.push(element.nbrUsers);

               this.barChartLabels.push(element.year);

        });



      }, (error: any) => { });

   }

  getListUsers() {

    this.users = [];

    this.ngxService.start();

    this.apiService.getListUsers(this.infosUser).subscribe((dataUsers: Array<UserModel>) => {

      console.log('dataUsers', dataUsers);

      // tslint:disable-next-line:prefer-for-of
      for (let index = 0; index < dataUsers.length; index++) {



        if (dataUsers[index].photoUser === '') {

          if (dataUsers[index].sex === 'F') {

            dataUsers[index].photoUser = './assets/img/users/user_f.png';


          }

          if (dataUsers[index].sex === 'H') {

            dataUsers[index].photoUser = './assets/img/users/user_m.png';


          }

        }

        dataUsers[index].date_created = this.datePipe.transform(dataUsers[index].date_created, 'dd-MM-yyyy  H:m');

        this.users.push(dataUsers[index]);

      }


      this.ngxService.stop();

    }, (error: any) => { });

    this.ngxService.stop();
  }

}
