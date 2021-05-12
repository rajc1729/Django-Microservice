from allauth.account.adapter import DefaultAccountAdapter


class CustomAccountAdapter(DefaultAccountAdapter):

    def save_user(self, request, user, form, commit=False):
        user = super().save_user(request, user, form, commit)
        data = form.cleaned_data
        user.address1 = data.get('address1')
        user.address2 = data.get('address2')
        user.city = data.get('city')
        user.country = data.get('country')
        user.latitude = data.get('latitude')
        user.longitude = data.get('longitude')
        # user.is_employer = data.get('is_employer')
        # user.is_employee = data.get('is_employee')
        if commit:
            user.save()
        return user